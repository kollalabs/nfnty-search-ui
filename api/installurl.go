package api

import (
	"context"
	"net/http"
	"net/url"
	"os"

	"golang.org/x/oauth2"
)

type connectorConfig struct {
	ConnectorInfo connectorInfo
	Audience      string
	AuthProvider  string
	AuthInfo      oauth2.Config
}

const (
	providerFusebit = "fusebit"
	providerOAuth   = "oauth2"
)

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
	SearchHandler  func(context.Context, connectorConfig, oauth2.TokenSource, string) (*SearchResults, error)
}

const redirectURL = "https://infinitysearch.xyz/api/installcallback"

// TODO: move into a file that is loaded at startup
var configs = map[string]connectorConfig{
	"connectors/job-nimbus": {
		ConnectorInfo: connectorInfo{
			Name:           "connectors/job-nimbus",
			DisplayName:    "Job Nimbus",
			Logo:           "https://www.jobnimbus.com/wp-content/uploads/2020/10/5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x.png",
			LogoSmall:      "https://www.jobnimbus.com/wp-content/uploads/2020/10/cropped-5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x-32x32.png",
			MarketplaceURL: "https://jobnimbus.kolla.market/",
			SearchHandler:  jobNimbusSearch,
		},
		AuthProvider: providerOAuth,
		Audience:     "https://data.job-nimbus.program.kolla.dev",
		AuthInfo: oauth2.Config{
			ClientID:     os.Getenv("JN_CLIENT_ID"),
			ClientSecret: os.Getenv("JN_CLIENT_SECRET"),
			Endpoint: oauth2.Endpoint{
				AuthURL:   "https://k-job-nimbus.us.auth0.com/authorize",
				TokenURL:  "https://k-job-nimbus.us.auth0.com/oauth/token",
				AuthStyle: oauth2.AuthStyleInParams,
			},
			Scopes: []string{
				"openid",
				"offline_access",
				"read:contacts",
				"read:schedules",
			},
		},
	},
	"connectors/fluid": {
		ConnectorInfo: connectorInfo{
			Name:           "connectors/fluid",
			DisplayName:    "Fluid",
			Logo:           "https://ik.imagekit.io/fluid/s3/logo.svg",
			LogoSmall:      "https://ik.imagekit.io/fluid/s3/logo.svg",
			MarketplaceURL: "https://fluid.kolla.market/",
			SearchHandler:  fluidSearch,
		},
		Audience:     "https://data.fluid.program.kolla.dev",
		AuthProvider: providerFusebit,
		AuthInfo: oauth2.Config{
			ClientID:     os.Getenv("FLUID_CLIENT_ID"),
			ClientSecret: os.Getenv("FLUID_CLIENT_SECRET"),
			Endpoint: oauth2.Endpoint{
				AuthURL:   "https://hydra-proxy-fluid-7dgilp22pa-uc.a.run.app/oauth2/auth",
				TokenURL:  "https://hydra-proxy-fluid-7dgilp22pa-uc.a.run.app/oauth2/token",
				AuthStyle: oauth2.AuthStyleInParams,
			},

			Scopes: []string{
				"openid",
				"offline_access",
				"read:contacts",
				"read:schedules",
			},
		},
	},
}

// Redirects the user to either the login page or sends them to the provider's
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
	ctx := r.Context()

	sub, err := r.Cookie("sub")
	if err != nil || sub.Value == "" {
		v := url.Values{}
		v.Set("redirect_uri", r.URL.String())
		return "/login?" + v.Encode(), nil
	}
	return installURLNoAuthRedirect(ctx, cfg, sub.Value)
}

func installURLNoAuthRedirect(ctx context.Context, cfg connectorConfig, sub string) (string, error) {
	// generate the URL to redirect to after the user have completed the oauth flow
	u, err := url.Parse(redirectURL)
	if err != nil {
		return "", err
	}
	v := u.Query()
	v.Set("sub", sub)
	v.Set("target", cfg.ConnectorInfo.Name)
	v.Set("auth_provider", cfg.AuthProvider)
	u.RawQuery = v.Encode()
	redirectURL := u.String()

	var installURL string
	if cfg.AuthProvider == providerFusebit {
		installURL, err = FusebitStartSessionURL(ctx, redirectURL, sub)
		if err != nil {
			return "", nil
		}
	} else {
		// make sure we're working on a copy of the auth config, otherwise we risk modifying the original
		var a oauth2.Config = cfg.AuthInfo
		// assume we're handling the OAuth flow
		a.RedirectURL = redirectURL // set the oauth2 config redirect URL

		codeOptions := []oauth2.AuthCodeOption{
			oauth2.ApprovalForce, // force consent page to show everytime
			oauth2.SetAuthURLParam("audience", cfg.Audience),
		}
		installURL = a.AuthCodeURL("", codeOptions...)
	}
	return installURL, nil
}
