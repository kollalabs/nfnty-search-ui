package api

import (
	"context"
	"net/http"
)

var handlers = map[string]func(ctx context.Context, filter string) ([]SearchResult, SearchMeta, error){
	"job-nimbus": jobNimbusSearch,
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	sub := "" // TODO: get sub
	apps, err := userApps(ctx, sub)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, app := range apps {
		f, ok := handlers[app.ConnectorName]
		if !ok {
			continue
		}
		_, _, err := f(ctx, r.URL.Query().Get("filter"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

}

type SearchResponse map[string]struct {
	Meta    SearchMeta     `json:"meta"`
	Results []SearchResult `json:"results"`
}

type SearchMeta struct {
	Logo        string `json:"logo"`
	DisplayName string `json:"display_name"`
}

type SearchResult struct {
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Link        string            `json:"link"`
	Kvdata      map[string]string `json:"kvdata,omitempty"`
}

func jobNimbusSearch(ctx context.Context, filter string) ([]SearchResult, SearchMeta, error) {
	return nil, SearchMeta{}, nil
}
