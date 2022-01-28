package api

import (
	"net/http"
	"net/url"
	"os"
	"strings"
)

type connectorConfig struct {
	ConnectorInfo connectorInfo
	AuthInfo      authInfo
}

type connectorInfo struct {
	Name        string
	DisplayName string
	Logo        string
	LogoSmall   string
}

type authInfo struct {
	AuthorizationURL string
	ClientID         string
	Audience         string
	Scopes           []string
}

// TODO: move into a file that is loaded at startup
var configs = map[string]connectorConfig{
	"connectors/job-nimbus": {
		ConnectorInfo: connectorInfo{
			Name:        "connectors/job-nimbus",
			DisplayName: "Job Nimbus",
			Logo:        "https://www.jobnimbus.com/wp-content/uploads/2020/10/5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x.png",
			LogoSmall:   "https://3401zs241c1u3z7ulj3z6g7u-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/cropped-5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x-32x32.png",
		},
		AuthInfo: authInfo{
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

	dest, err := installURLWithAuthRedirect(r, cfg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, dest, http.StatusFound)

}

func installURLWithAuthRedirect(r *http.Request, cfg connectorConfig) (string, error) {

	sub, err := r.Cookie("sub")
	if err != nil || sub.Value == "" {
		v := url.Values{}
		v.Set("redirect_uri", r.URL.String())
		return "/login?" + v.Encode(), nil
	}
	return installURLNoAuthRedirect(cfg, sub.Value)
}

func installURLNoAuthRedirect(cfg connectorConfig, sub string) (string, error) {
	// make sure that we have a cookie with the user's ID in it so we can link the tokens together
	a := cfg.AuthInfo

	rv := url.Values{}

	// TODO: pass this information through via a secure channel instead of plaintext
	rv.Set("target", cfg.ConnectorInfo.Name)
	rv.Set("sub", sub)
	redirectURI := "https://infinitysearch.xyz/api/installcallback?" + rv.Encode()

	v := url.Values{}

	v.Set("response_type", "code")
	v.Set("client_id", a.ClientID)
	v.Set("redirect_uri", redirectURI)
	v.Set("audience", a.Audience)
	v.Set("scope", strings.Join(a.Scopes, " "))
	v.Set("prompt", "consent")

	u := a.AuthorizationURL + "?" + v.Encode()

	return u, nil
}
