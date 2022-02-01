package api

import "net/http"

func SearchHandler(w http.ResponseWriter, r *http.Request) {

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
