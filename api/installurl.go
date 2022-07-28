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
			Logo:           "https://media-exp1.licdn.com/dms/image/C560BAQEMDuGUh1wAoA/company-logo_200_200/0/1601329489976?e=1660780800&v=beta&t=1x9Qg-bs1r4UYEt4x1nolX6hVh9XLJU_0LWAY15uiPw",
			LogoSmall:      "https://media-exp1.licdn.com/dms/image/C560BAQEMDuGUh1wAoA/company-logo_200_200/0/1601329489976?e=1660780800&v=beta&t=1x9Qg-bs1r4UYEt4x1nolX6hVh9XLJU_0LWAY15uiPw",
			MarketplaceURL: "https://jobnimbus.kolla.market/explore/wuv6u4oesbdalgoygino2k2hjm",
			SearchHandler:  jobNimbusSearch,
		},
		Audience: "https://jobnimbus.data.kolla.dev",
		AuthInfo: oauth2.Config{
			ClientID:     os.Getenv("JN_CLIENT_ID"),
			ClientSecret: os.Getenv("JN_CLIENT_SECRET"),
			Endpoint: oauth2.Endpoint{
				AuthStyle: oauth2.AuthStyleInParams,
				AuthURL:   "https://jobnimbus.oidc.kolla.market/oauth2/authorize",
				TokenURL:  "https://jobnimbus.oidc.kolla.market/oauth2/token",
			},
			Scopes: []string{
				"openid",
				"offline_access",
				"read:contacts",
				"read:schedules",
			},
		},
		AuthProvider: providerOAuth,
	},
	"connectors/fluid": {
		ConnectorInfo: connectorInfo{
			Name:           "connectors/fluid",
			DisplayName:    "Fluid",
			Logo:           "https://ik.imagekit.io/fluid/s3/logo.svg",
			LogoSmall:      "https://ik.imagekit.io/fluid/s3/logo.svg",
			MarketplaceURL: "https://fluid.kolla.market/explore/xuufriqqnzgivdplio6442crwq",
			SearchHandler:  fluidSearch,
		},
		Audience: "https://fluid.data.kolla.dev",
		AuthInfo: oauth2.Config{
			ClientID:     os.Getenv("FLUID_CLIENT_ID"),
			ClientSecret: os.Getenv("FLUID_CLIENT_SECRET"),
			Endpoint: oauth2.Endpoint{
				AuthStyle: oauth2.AuthStyleInParams,
				AuthURL:   "https://fluid.oidc.kolla.market/oauth2/auth",
				TokenURL:  "https://fluid.oidc.kolla.market/oauth2/token",
			},
			Scopes: []string{
				"openid",
				"offline_access",
				// "data:contacts:read",
				// "data:users:read",
				// "data:orders:read",
			},
		},
		AuthProvider: providerOAuth,
	},
}

// Redirects the user to either the login page or sends them to the provider's
// oauth authorization page.
// Users may have been redirected to this handler from the target connector's
// marketplace page.
// This endpoint is currently unused.
func InstallURLHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		return
	}

	cfg, ok := configs[r.URL.Query().Get("target")]
	if !ok {
		http.Error(w, "unknown connector target", http.StatusBadRequest)
		return
	}

	dest, err := oauthConnectURLWithAuthRedirect(r, cfg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, dest, http.StatusFound)

}

// oauthConnectURLWithAuthRedirect returns the URL used to connect the user to the requested
// connection target. If the user is not logged in, the user is redirected to the
// infinity-search login page.
func oauthConnectURLWithAuthRedirect(r *http.Request, cfg connectorConfig) (string, error) {
	ctx := r.Context()

	sub, err := r.Cookie("sub")
	if err != nil || sub.Value == "" {
		v := url.Values{}
		v.Set("redirect_uri", r.URL.String())
		return "/login?" + v.Encode(), nil
	}
	return oauthConnectURL(ctx, cfg, sub.Value)
}

// oauthConnectURL generates the necessary oauth authorization URL used to initiate the oauth login
// and consent flow.
func oauthConnectURL(ctx context.Context, cfg connectorConfig, sub string) (string, error) {
	// generate the URL to redirect to after the user have completed the oauth flow
	u, err := url.Parse(redirectURL)
	if err != nil {
		return "", err
	}
	v := u.Query()
	v.Set("sub", sub)
	v.Set("target", cfg.ConnectorInfo.Name)
	v.Set("auth_provider", cfg.AuthProvider)

	var installURL string
	if cfg.AuthProvider == providerFusebit {
		u.RawQuery = v.Encode()
		redirectURL := u.String()
		installURL, err = FusebitStartSessionURL(ctx, cfg.ConnectorInfo.Name, sub, redirectURL)
		if err != nil {
			return "", err
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
		installURL = a.AuthCodeURL(v.Encode(), codeOptions...)
	}
	return installURL, nil
}
