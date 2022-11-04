package api

import (
	"context"
	"net/http"

	"golang.org/x/oauth2"
)

type connectorConfig struct {
	Name           string
	DisplayName    string
	MarketplaceURL string
	SearchHandler  func(context.Context, connectorConfig, oauth2.TokenSource, string) (*SearchResults, error)
}

func (c *connectorConfig) SearchMetadata() ConnectorMeta {
	return ConnectorMeta{
		Name:        c.Name,
		DisplayName: c.DisplayName,
	}
}

// TODO: move into a file that is loaded at startup
var configs = map[string]connectorConfig{
	"connectors/job-nimbus": {

		Name:           "connectors/job-nimbus",
		DisplayName:    "Job Nimbus",
		MarketplaceURL: "https://jobnimbus.kolla.market/explore/wuv6u4oesbdalgoygino2k2hjm",
		SearchHandler:  jobNimbusSearch,
	},
	"connectors/fluid": {
		Name:           "connectors/fluid",
		DisplayName:    "Fluid",
		MarketplaceURL: "https://fluid.kolla.market/explore/xuufriqqnzgivdplio6442crwq",
		SearchHandler:  fluidSearch,
	},
}

// InstallURLHandler is a placeholder for Vercel
func InstallURLHandler(w http.ResponseWriter, r *http.Request) {
}
