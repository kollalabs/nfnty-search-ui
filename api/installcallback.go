package api

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"
)

// CallbackHandler
// https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
// Handles steps 3, 4, and 5 of the Authorization code flow
const (
	tokenURL    = "https://k-job-nimbus.us.auth0.com/oauth/token"
	redirectURI = "http://127.0.0.1:3000"
)

var (
	isConfigured = false
	clientID     = os.Getenv("JN_CLIENT_ID")
	clientSecret = os.Getenv("JN_CLIENT_SECRET")
)

func init() {
	if clientID == "" || clientSecret == "" {
		return
	}
	isConfigured = true
}

func CallbackHandler(w http.ResponseWriter, r *http.Request) {
	if !isConfigured {
		http.Error(w, "callback handler is not configured", http.StatusInternalServerError)
		return
	}

	authorizationCode := r.URL.Query().Get("code")
	if authorizationCode == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	args := url.Values{}
	args.Set("grant_type", "authorization_code")
	args.Set("client_id", clientID)
	args.Set("client_secret", clientSecret)
	args.Set("code", authorizationCode)
	args.Set("redirect_uri", redirectURI)

	u := tokenURL

	req, err := http.NewRequest(http.MethodPost, u, strings.NewReader(args.Encode()))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	req.Header.Set("content-type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if resp.StatusCode >= 300 {
		b, _ := ioutil.ReadAll(resp.Body)
		http.Error(w, string(b)+"\n"+u, resp.StatusCode)
		return
	}

	var tok tokenResponse
	err = json.NewDecoder(resp.Body).Decode(&tok)
	if err != nil {
		http.Error(w, err.Error(), resp.StatusCode)
		return
	}

	_ = json.NewEncoder(w).Encode(tok)

}

type tokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	IDToken      string `json:"id_token"`
	Scopes       string `json:"scope"`
	ExpiresIn    int64  `json:"expires_in"`
	TokenType    string `json:"token_type"`
}
