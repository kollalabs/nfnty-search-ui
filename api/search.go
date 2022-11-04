package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/kollalabs/nfnty-search-ui/api/jobnimbusclient"
	"golang.org/x/oauth2"
	"google.golang.org/protobuf/encoding/protojson"
)

var connectAPIKey = os.Getenv("KOLLA_CONNECT_API_KEY")

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		return
	}

	ctx := context.Background()
	sub, err := isAuthed(ctx, r)
	if sub == "" {
		http.Error(w, "authorization required", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, "-"+err.Error(), http.StatusUnauthorized)
		return
	}

	filter := r.URL.Query().Get("filter")
	if len(filter) <= 2 {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{}`))
		return
	}

	apps, err := userApps(ctx, sub)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(apps) == 0 {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{}`))
		return
	}

	response := make(SearchResponse)
	for _, install := range apps {
		var err error
		cfg, ok := configs[install.ConnectorName]
		if !ok {
			continue
		}
		f := cfg.SearchHandler

		ts, err := NewTokenSource(ctx, connectAPIKey, cfg.Name, sub)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to to get token source [%s] [%s]", install.ConnectorName, err), http.StatusInternalServerError)
			return
		}
		response[install.ConnectorName], err = f(ctx, cfg, ts, filter)
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to perform request to [%s] [%s]", install.ConnectorName, err), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(response)

}

type SearchResponse map[string]*SearchResults

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

func jobNimbusSearch(ctx context.Context, cfg connectorConfig, ts oauth2.TokenSource, filter string) (*SearchResults, error) {
	v := url.Values{
		"filter":    []string{filter},
		"page_size": []string{"5"},
	}

	u := jobNimbusMediatorURL + "/v1/contacts?" + v.Encode()
	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, err
	}
	t, err := ts.Token()
	if err != nil {
		return nil, err
	}
	t.SetAuthHeader(req)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	b, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("invalid status code: %d [%s]", resp.StatusCode, string(b))
	}

	var listResponse jobnimbusclient.ListContactsResponse
	err = protojson.UnmarshalOptions{
		DiscardUnknown: false,
	}.Unmarshal(b, &listResponse)
	if err != nil {
		return nil, err
	}

	var list []ConnectorResult
	for _, v := range listResponse.Contacts {
		c := convertJobNimbusContact(v)
		list = append(list, c)
	}

	result := SearchResults{
		Meta:    cfg.SearchMetadata(),
		Results: list,
	}

	return &result, nil
}

func convertJobNimbusContact(c *jobnimbusclient.Contact) ConnectorResult {
	name := strings.TrimSpace(c.GivenName + " " + c.FamilyName)
	if len(name) == 0 {
		name = c.DisplayName
	}
	data := make(map[string]string)
	addIfSet(data, "Company", c.Company)
	addIfSet(data, "Home Phone", c.PhoneHome)
	addIfSet(data, "Mobile Phone", c.PhoneMobile)
	addIfSet(data, "Work Phone", c.PhoneWork)
	addIfSet(data, "Other Phone", c.PhoneOther)
	addIfSet(data, "Email", c.Email)
	// TODO: get contact methods in here

	return ConnectorResult{
		Title:       "Contact - " + name,
		Description: name + " is a contact in Job Nimbus",
		Link:        "https://app.jobnimbus.com/contact/" + c.Jnid,
		Kvdata:      data,
	}
}

func fluidSearch(ctx context.Context, cfg connectorConfig, t oauth2.TokenSource, filter string) (*SearchResults, error) {
	/*
		t, err := accessToken(ctx, t.ConnectorName, tenantID)
		if err != nil {
			return nil, err
		}
	*/
	// for now return an empty search results struct
	return &SearchResults{}, nil
}

func addIfSet(data map[string]string, label string, value string) {
	if value == "" {
		return
	}
	data[label] = value
}
