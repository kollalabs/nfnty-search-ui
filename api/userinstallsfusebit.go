package api

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
)

var fusebitBase = `https://api.us-west-1.on.fusebit.io/v2/account/acc-3a72dea47d034728/subscription/sub-1d5ca7558f244bce/integration/nfnty-search`
var fusebitToken = ``

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
		return "", nil
	}
	defer resp.Body.Close()

	var session FusebitSession
	err = json.NewDecoder(resp.Body).Decode(&session)
	if err != nil {
		return "", nil
	}

	return session.TargetURL, nil
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
