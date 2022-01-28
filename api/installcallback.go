package api

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

// CallbackHandler
// https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
// Handles steps 3, 4, and 5 of the Authorization code flow
const (
	tokenURL = "https://k-job-nimbus.us.auth0.com/oauth/token"

	datastoreProjectID = "infinity-search-339422"
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
	ctx := r.Context()

	errorResponse := r.URL.Query().Get("error")
	if errorResponse != "" {
		msg := errorResponse + " " + r.URL.Query().Get("error_description")
		http.Error(w, msg, http.StatusOK)
		return
	}

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
	args.Set("redirect_uri", reconstructRedirectURI(r))

	u := tokenURL

	req, err := http.NewRequest(http.MethodPost, u, strings.NewReader(args.Encode()))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	req.Header.Set("content-type", "application/x-www-form-urlencoded")

	out, _ := httputil.DumpRequest(req, true)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if resp.StatusCode >= 300 {
		b, _ := ioutil.ReadAll(resp.Body)
		http.Error(w, string(b)+"\n\n"+string(out), resp.StatusCode)
		return
	}

	var tok tokenInfo
	err = json.NewDecoder(resp.Body).Decode(&tok)
	if err != nil {
		http.Error(w, err.Error(), resp.StatusCode)
		return
	}

	err = saveUserAppToken(ctx, "", &tok)
	if err != nil {
		http.Error(w, err.Error(), resp.StatusCode)
		return
	}

	_ = json.NewEncoder(w).Encode(tok)

}

type tokenInfo struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	IDToken      string `json:"id_token"`
	Scopes       string `json:"scope"`
	ExpiresIn    int64  `json:"expires_in"`
	TokenType    string `json:"token_type"`

	InfinitySearchUser string `json:"infinity_search_user,omitempty"`
}

func reconstructRedirectURI(r *http.Request) string {
	scheme := r.URL.Scheme
	if scheme == "" {
		scheme = os.Getenv("JN_REDIRECT_URI_SCHEME")
	}

	u := url.URL{
		Scheme: scheme,
		Host:   r.Host,
		Path:   r.URL.Path,
	}

	return u.String()
}
