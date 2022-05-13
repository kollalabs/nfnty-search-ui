package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

var fusebitBase = `https://api.us-west-1.on.fusebit.io/v2/account/acc-3a72dea47d034728/subscription/sub-1d5ca7558f244bce/integration/nfnty-search`
var fusebitToken = ``

// placeholder handler for Vercal
func UserInstallFusebitHandler(w http.ResponseWriter, r *http.Request) {}

func FusebitUserApps(ctx context.Context, sub string) (map[string]installInfo, error) {
	// To get a user’s install profile on Fusebit, search for all app installs and filter by the fusebit.tenantId tag
	u := fusebitBase + "/install?tag=fusebit.tenantId:" + sub

	req, err := http.NewRequest(http.MethodPost, u, nil)
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

	var installs FusebitInstallsResponse
	err = json.NewDecoder(resp.Body).Decode(&installs)
	if err != nil {
		return nil, err
	}

	if len(installs.Items) > 1 {
		return nil, fmt.Errorf("too many installs found for tenant")
	}

	for k, v := range installs.Items[0].Data {
		fmt.Println(k, v) // TODO map from fusebit connector instance to our connector instance
	}

	return nil, nil
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
func FusebitStartSessionURL(ctx context.Context, sub string, redirectURL string) (string, error) {
	u := fusebitBase + "/session"

	sessionRequest := FusebitSessionRequest{
		RedirectURL: redirectURL,
		Tags: map[string]string{
			"fusebit.tenantId": sub,
		},
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
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status code %d, body [%s]", resp.StatusCode, body)
	}

	var session FusebitSession
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
}

type FusebitSession struct {
	TargetURL string `json:"target_url"`
}

/*
curl 'https://api.us-west-1.on.fusebit.io/v2/account/acc-3a72dea47d034728/subscription/sub-1d5ca7558f244bce/integration/nfnty-search/session' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer `fuse token -o raw`" -v \
  -d '{ "redirectUrl": "http://localhost:8000/something/callback", "tags": { "fusebit.tenantId": "some tenant id" } }'
*/
