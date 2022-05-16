package api

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

var fusebitBase = `https://api.us-west-1.on.fusebit.io/v2/account/acc-3a72dea47d034728/subscription/sub-1d5ca7558f244bce/integration/nfnty-search`
var fusebitToken = os.Getenv("FUSEBIT_TOKEN")

// placeholder handler for Vercel
func UserInstallFusebitHandler(w http.ResponseWriter, r *http.Request) {}

func FusebitUserApps(ctx context.Context, sub string) (map[string]installInfo, error) {
	// To get a user’s install profile on Fusebit, search for all app installs and filter by the fusebit.tenantId tag
	tenantID := toFusebitTenantID(sub)

	u := fusebitBase + "/install"
	v := url.Values{}
	v.Add("tag", "fusebit.tenantId="+tenantID)
	u += "?" + v.Encode()

	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer "+fusebitToken)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("status code %d, body [%s]", resp.StatusCode, body)
	}

	var fusebitInstalls FusebitInstallsResponse
	err = json.NewDecoder(resp.Body).Decode(&fusebitInstalls)
	if err != nil {
		return nil, err
	}

	if len(fusebitInstalls.Items) > 1 {
		return nil, fmt.Errorf("too many installs found for tenant")
	}

	installs := make(map[string]installInfo)
	if len(fusebitInstalls.Items) == 0 {
		return installs, nil
	}

	for k := range fusebitInstalls.Items[0].Data {
		installs[k] = installInfo{
			Scopes:             nil, // TODO: need to separately from Fusebit to get this?
			ConnectorName:      k,
			InfinitySearchUser: sub,
		}
	}

	return installs, nil
}

type FusebitInstallsResponse struct {
	Items []FusebitInstallItem `json:"items"`
}

type FusebitInstallItem struct {
	ID       string `json:"id"`
	ParentID string `json:"parentId"`
	Data     map[string]FusebitConnectorInstall
}

type FusebitConnectorInstall struct {
	EntityID string `json:"entityId"`
}

//FusebitStartSessionURL returns a url for the user to start the Fusebit install process
func FusebitStartSessionURL(ctx context.Context, connector string, sub string, redirectURL string) (string, error) {
	u := fusebitBase + "/session"

	sessionRequest := FusebitSessionRequest{
		RedirectURL: redirectURL,
		Tags: map[string]string{
			"fusebit.tenantId": toFusebitTenantID(sub),
		},
		Components: []string{connector},
	}

	body := bytes.NewBuffer(nil)
	err := json.NewEncoder(body).Encode(sessionRequest)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(http.MethodPost, u, body)
	if err != nil {
		return "", err
	}
	req.Header.Add("Authorization", "Bearer "+fusebitToken)
	req.Header.Add("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status code %d, body [%s]", resp.StatusCode, body)
	}

	var session FusebitSessionResponse
	err = json.NewDecoder(resp.Body).Decode(&session)
	if err != nil {
		return "", err
	}

	return session.TargetURL, nil
}

func FusebitStartSessionCommit(ctx context.Context, sessionID string) error {
	u := fusebitBase + "/session/" + url.PathEscape(sessionID) + "/commit"

	req, err := http.NewRequest(http.MethodPost, u, nil)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", "Bearer "+fusebitToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("status code %d, body [%s]", resp.StatusCode, body)
	}

	// TODO: poll the install url and wait until the install is complete

	return nil
}

type FusebitSessionRequest struct {
	RedirectURL string            `json:"redirectUrl"`
	Tags        map[string]string `json:"tags"`
	Components  []string          `json:"-"`
}

type FusebitSessionResponse struct {
	TargetURL string `json:"targetUrl"`
}

func FusebitAccessToken(ctx context.Context, connector string, tenantID string) (string, error) {
	tenantID = toFusebitTenantID(tenantID)
	u := fusebitBase + "/api/connector/" + connector + "/tenant/" + url.PathEscape(tenantID)

	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Authorization", "Bearer "+fusebitToken)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", nil
	}
	defer resp.Body.Close()

	type FusebitAccessTokenResponse struct {
		Authorization string `json:"authorization"`
	}

	data := FusebitAccessTokenResponse{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return "", nil
	}

	return data.Authorization, nil
}

// to fusebit tenant ID converts a generic id into a fusebit compatible tenant id
// that conforms to the regex [a-zA-Z0-9_\-\.%\/]*
func toFusebitTenantID(tenantID string) string {
	// base64 encode the tenant ID
	encodedTenantID := base64.RawStdEncoding.EncodeToString([]byte(tenantID))
	return encodedTenantID
}
