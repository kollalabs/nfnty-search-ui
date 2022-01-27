package api

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
)

// CallbackHandler
// https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
// Handles steps 3, 4, and 5 of the Authorization code flow
const (
	tokenURL = "https://k-job-nimbus.us.auth0.com/oauth/token"
)

var (
	clientID     = os.Getenv("CLIENT_ID")
	clientSecret = os.Getenv("CLIENT_SECRET")
)

func CallbackHandler(w http.ResponseWriter, r *http.Request) {
	authorizationCode := r.Form.Get("code")
	if authorizationCode == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
	}

	args := url.Values{}
	args.Add("client_id", clientID)
	args.Add("client_secret", clientSecret)
	args.Add("grant_type", "authorization_code")
	args.Add("code", authorizationCode)

	u := tokenURL

	u += "?" + args.Encode()
	req, err := http.NewRequest(http.MethodPost, u, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	b, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		http.Error(w, string(b), http.StatusInternalServerError)
		return
	}

	fmt.Println(string(b))

	w.Write(b)
}
