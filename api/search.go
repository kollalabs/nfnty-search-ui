package api

import (
	"context"
	"fmt"
	"net/http"
)

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	sub := "" // TODO: get sub
	apps, err := userApps(ctx, sub)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(apps)
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
