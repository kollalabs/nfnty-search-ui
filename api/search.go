package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/kollalabs/nfnty-search-ui/api/jobnimbusclient"
	"google.golang.org/protobuf/encoding/protojson"
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
		http.Error(w, "-"+err.Error(), http.StatusUnauthorized)
		return
	}

	apps, err := userApps(ctx, sub)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := make(SearchResponse)
	for _, appToken := range apps {
		f, ok := handlers[appToken.ConnectorName]
		if !ok {
			continue
		}
		var err error
		response[appToken.ConnectorName], err = f(ctx, appToken, r.URL.Query().Get("filter"))
		if err != nil {
			http.Error(w, fmt.Sprintf("unable to perform request to [%s] [%s]", appToken.ConnectorName, err), http.StatusInternalServerError)
			return
		}

	}
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

func jobNimbusSearch(ctx context.Context, t tokenInfo, filter string) (*SearchResults, error) {
	v := url.Values{
		"filter": []string{"filter"},
	}

	// TODO: this whole refresh token blob needs to be extracted into a more
	// general place
	cfg, ok := configs[t.ConnectorName]
	if !ok {
		return nil, fmt.Errorf("unable to find config for [%s]", t.ConnectorName)
	}
	tokenSource := cfg.AuthInfo.TokenSource(ctx, t.Token)

	token, err := tokenSource.Token()
	if err != nil {
		return nil, err
	}
	// check if access token or refresh token have been rotated
	// (not all refresh tokens are rotated)
	if token.RefreshToken != t.RefreshToken || token.AccessToken != t.AccessToken {
		t.AccessToken = token.RefreshToken
		t.RefreshToken = token.RefreshToken
		err := saveUserAppToken(ctx, &t)
		if err != nil {
			return nil, err
		}
	}

	u := jobNimbusMediatorURL + "/v1/contacts?" + v.Encode()
	req, err := http.NewRequest(http.MethodGet, u, nil)
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
		return nil, fmt.Errorf("invlid status code: %d [%s]", resp.StatusCode, string(b))
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

	// TODO: reformat response into the Infinity Search format
	result := SearchResults{
		Meta:    jobNimbusMetadata,
		Results: list,
	}

	return &result, nil
}

func convertJobNimbusContact(c *jobnimbusclient.Contact) ConnectorResult {
	name := strings.TrimSpace(c.GivenName + " " + c.FamilyName)
	data := make(map[string]string)
	addIfSet(data, "Company", c.Company)
	// TODO: get contact methods in here

	return ConnectorResult{
		Title:       "Contact - " + name,
		Description: name + " is a contact in Job Nimbus",
		Link:        "https://app.jobnimbus.com/contact" + c.Jnid,
		Kvdata:      data,
	}
}

func addIfSet(data map[string]string, label string, value string) {
	if value == "" {
		return
	}
	data[label] = value
}

var jobNimbusMetadata = ConnectorMeta{
	Name:        "connectors/job-nimbus",
	Logo:        "https://3401zs241c1u3z7ulj3z6g7u-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/cropped-5.-JN_Logo_Social_Submark_Condensed-Blue-Copy-3@1x-32x32.png",
	DisplayName: "JobNimbus",
}
