package api

import (
	"net/http"
	"net/url"
	"os"
	"strings"
)

type authConfig struct {
	AuthorizationURL string
	ClientID         string
	Audience         string
	Scopes           []string
}

// TODO: move into a file that is loaded at startup?
var configs = map[string]authConfig{
	"job-nimbus": {
		AuthorizationURL: "https://k-job-nimbus.us.auth0.com/authorize",
		ClientID:         os.Getenv("JN_CLIENT_ID"),
		Audience:         "https://data.job-nimbus.program.kolla.dev",
		Scopes: []string{
			"openid",
			"offline_access",
			"read:contacts",
			"read:schedules",
		},
	},
}

// Redirects the user to either the login page or sends them to the providers
// oauth authorization page
func InstallURLHandler(w http.ResponseWriter, r *http.Request) {

	cfg, ok := configs[r.URL.Query().Get("target")]
	if !ok {
		http.Error(w, "unknown connector target", http.StatusBadRequest)
		return
	}

	dest, err := installURL(r, cfg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, dest, http.StatusFound)

}

func installURL(r *http.Request, cfg authConfig) (string, error) {

	sub, err := r.Cookie("sub")
	if err != nil || sub.Value == "" {
		v := url.Values{}
		v.Set("redirect_uri", r.URL.String())
		return "/login?" + v.Encode(), nil
	}

	// make sure that we have a cookie with the user's ID in it so we can link the tokens together

	//https://k-job-nimbus.us.auth0.com/authorize?response_type=code&client_id=eeU34NxSzxcYHKIzf6UzKWxI9ICwDZzN&redirect_uri=https://infinitysearch.xyz/api/installcallback&audience=https://data.job-nimbus.program.kolla.dev&state=hiddenstate&scope=openid%20offline_access%20read:contacts%20read:schedules&prompt=consent
	v := url.Values{}
	v.Set("response_type", "code")
	v.Set("client_id", cfg.ClientID)
	v.Set("redirect_uri", "https://infinitysearch.xyz/api/installcallback")
	v.Set("audience", cfg.Audience)
	v.Set("scope", strings.Join(cfg.Scopes, " "))
	v.Set("prompt", "consent")

	u := cfg.AuthorizationURL + "?" + v.Encode()

	return u, nil
}
