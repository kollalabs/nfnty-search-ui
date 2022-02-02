package api

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

var handlers = map[string]func(context.Context, tokenInfo, string) (*SearchResults, error){
	"connectors/job-nimbus": jobNimbusSearch,
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	sub, err := isAuthed(ctx, r)
	if sub == "" {
		http.Error(w, "authorization required", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	apps, err := userApps(ctx, sub)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, appToken := range apps {
		f, ok := handlers[appToken.ConnectorName]
		if !ok {
			continue
		}
		_, err := f(ctx, appToken, r.URL.Query().Get("filter"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

}

type SearchResponse map[string]SearchResults

type SearchResults struct {
	Meta    ConnectorMeta     `json:"meta"`
	Results []ConnectorResult `json:"results"`
}

type ConnectorMeta struct {
	Name        string `json:"name"`
	Logo        string `json:"logo"`
	DisplayName string `json:"display_name"`
}

type ConnectorResult struct {
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Link        string            `json:"link"`
	Kvdata      map[string]string `json:"kvdata,omitempty"`
}

const jobNimbusMediatorURL = "https://c-job-nimbus-7dgilp22pa-uc.a.run.app"

func jobNimbusSearch(ctx context.Context, t tokenInfo, filter string) (*SearchResults, error) {
	v := url.Values{
		"filter": []string{"filter"},
	}

	u := jobNimbusMediatorURL + "/v1/contacts?" + v.Encode()
	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+t.AccessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("invlid status code: %d [%s]", resp.StatusCode, string(b))
	}

	// TODO: reformat response into the Infinity Search format
	result := SearchResults{
		Meta:    jobNimbusMetadata,
		Results: nil,
	}

	return &result, fmt.Errorf("not implemented")
}

var jobNimbusMetadata = ConnectorMeta{
	Name:        "connectors/job-nimbus",
	Logo:        "https://3401zs241c1u3z7ulj3z6g7u-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/cropped-5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x-32x32.png",
	DisplayName: "JobNimbus",
}
