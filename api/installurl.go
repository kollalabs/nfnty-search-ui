package api

import (
	"net/http"
	"net/url"
	"os"

	"golang.org/x/oauth2"
)

type connectorConfig struct {
	ConnectorInfo connectorInfo
	Audience      string
	AuthInfo      oauth2.Config
}

func (c *connectorConfig) SearchMetadata() ConnectorMeta {
	return ConnectorMeta{
		Name:        c.ConnectorInfo.Name,
		Logo:        c.ConnectorInfo.Logo,
		DisplayName: c.ConnectorInfo.DisplayName,
	}
}

type connectorInfo struct {
	Name           string
	DisplayName    string
	Logo           string
	LogoSmall      string
	MarketplaceURL string
}

// TODO: move into a file that is loaded at startup
var configs = map[string]connectorConfig{
	"connectors/job-nimbus": {
		ConnectorInfo: connectorInfo{
			Name:           "connectors/job-nimbus",
			DisplayName:    "Job Nimbus",
			Logo:           "https://www.jobnimbus.com/wp-content/uploads/2020/10/5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x.png",
			LogoSmall:      "https://www.jobnimbus.com/wp-content/uploads/2020/10/cropped-5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x-32x32.png",
			MarketplaceURL: "https://jobnimbus.kolla.market/",
		},
		Audience: "https://data.job-nimbus.program.kolla.dev",
		AuthInfo: oauth2.Config{
			ClientID:     os.Getenv("JN_CLIENT_ID"),
			ClientSecret: os.Getenv("JN_CLIENT_SECRET"),
			Endpoint: oauth2.Endpoint{
				AuthURL:   "https://k-job-nimbus.us.auth0.com/authorize",
				TokenURL:  "https://k-job-nimbus.us.auth0.com/oauth/token",
				AuthStyle: oauth2.AuthStyleInParams,
			},
			RedirectURL: "https://infinitysearch.xyz/api/installcallback",
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
	if r.Method == http.MethodOptions {
		return
	}

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

	u, err := url.Parse(a.RedirectURL)
	if err != nil {
		return "", err
	}
	v := u.Query()
	v.Set("sub", sub)
	v.Set("target", cfg.ConnectorInfo.Name)
	u.RawQuery = v.Encode()
	a.RedirectURL = u.String()

	codeOptions := []oauth2.AuthCodeOption{
		oauth2.ApprovalForce, // force consent page to show everytime
		oauth2.SetAuthURLParam("audience", cfg.Audience),
	}
	codeURL := a.AuthCodeURL("", codeOptions...)
	return codeURL, nil
}
