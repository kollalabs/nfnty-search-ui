package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type ConnectorsResponse struct {
	Connectors []Connector `json:"connectors"`
}

type Connector struct {
	Name        string `json:"name"`
	DisplayName string `json:"display_name"`
	Logo        string `json:"logo"`
	LogoSmall   string `json:"logo_small"`
	Connected   bool   `json:"connected"`
	InstallURL  string `json:"install_url"`
}

func ConnectorsHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: check auth, if authed, load all connected apps
	// TODO: only return install url if the user is logged in
	ctx := r.Context()

	list := connectors()

	sub, err := isAuthed(ctx, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	if sub != "" {
		// merge connected
		err := mergeConnected(ctx, sub, list)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		for i, v := range list {
			v.InstallURL, err = installURLNoAuthRedirect(configs[v.Name])
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			list[i] = v
		}
		// add install urls
	}

	resp := ConnectorsResponse{
		Connectors: list,
	}

	_ = json.NewEncoder(w).Encode(resp)

}

func mergeConnected(ctx context.Context, sub string, list []Connector) error {
	// load list of installed apps
	installed, err := userApps(ctx, sub)
	if err != nil {
		return fmt.Errorf("unable to load user's apps: %w", err)
	}

	for i, v := range list {
		for _, app := range installed {
			if app.AppName == v.Name {
				v.Connected = true
				list[i] = v
			}
		}
	}

	return nil
}

func connectors() []Connector {
	list := []Connector{}
	for _, v := range configs {
		info := v.ConnectorInfo
		list = append(list, Connector{
			Name:        info.Name,
			DisplayName: info.DisplayName,
			Logo:        info.Logo,
			LogoSmall:   info.LogoSmall,
		})
	}

	return list
}
