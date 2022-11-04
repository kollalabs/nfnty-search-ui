package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"cloud.google.com/go/datastore"
	"golang.org/x/sync/errgroup"
	"google.golang.org/api/option"
)

// UserInstallHandler is a placeholder for Vercel
func UserInstallHandler(w http.ResponseWriter, r *http.Request) {}

const (
	datastoreTokenKind = "OAuthToken"
	datastoreProjectID = "infinity-search-339422"
)

var defaultDataStore struct {
	client *datastore.Client
}

func init() {

	ctx := context.Background()
	client, err := datastoreClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	defaultDataStore.client = client
}

type installInfo struct {
	ConnectorName string
	Active        bool
}

// userApps returns a list of all of a user's installed connectors
// from Kolla Connect
func userApps(ctx context.Context, sub string) (map[string]installInfo, error) {
	wg := errgroup.Group{}

	grpA := make(map[string]installInfo)
	wg.Go(func() error {
		filter := "state = 'ACTIVE' AND consumer_id = '" + sub + "'"
		v := url.Values{
			"filter": []string{filter},
		}
		u := "https://connect.getkolla.com/v1/connectors/-/linkedaccounts" + v.Encode()
		req, _ := http.NewRequest(http.MethodGet, u, nil)
		req.Header.Set("Authorization", connectAPIKey)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return err
		}
		if resp.StatusCode != http.StatusOK {
			return fmt.Errorf("failed to load linked accounts: [%d]", resp.StatusCode)
		}
		type linkedAccountListResponse struct {
			LinkedAccounts []struct {
				Name       string `json:"name"`
				State      string `json:"state"`
				ConsumerID string `json:"consumer_id"`
			} `json:"linked_accounts"`
		}
		var list linkedAccountListResponse
		err = json.NewDecoder(resp.Body).Decode(&list)
		if err != nil {
			return err
		}
		for _, v := range list.LinkedAccounts {
			c, ok := grpA[v.Name]
			if ok && c.Active {
				continue
			}
			parts := strings.Split(v.Name, "/")
			connector := parts[0] + "/" + parts[1]
			grpA[v.Name] = installInfo{
				ConnectorName: connector,
				Active:        v.State == "ACTIVE",
			}
		}
		return nil
	})

	err := wg.Wait()
	if err != nil {
		return nil, err
	}

	return grpA, nil
}

func datastoreClient(ctx context.Context) (*datastore.Client, error) {
	if defaultDataStore.client != nil {
		return defaultDataStore.client, nil
	}

	credsJSON := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")

	options := []option.ClientOption{}
	if credsJSON != "" {
		options = append(options, option.WithCredentialsJSON([]byte(credsJSON)))
	}

	// Create a datastore client. In a typical application, you would create
	// a single client which is reused for every datastore operation.
	dsClient, err := datastore.NewClient(ctx, datastoreProjectID, options...)
	if err != nil {
		log.Fatal(err)
	}

	return dsClient, nil
}

func datastoreUserApps(ctx context.Context, sub string) (map[string]installInfo, error) {
	dsClient, err := datastoreClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get client: %w", err)
	}

	query := datastore.NewQuery(datastoreTokenKind).FilterField("InfinitySearchUser", "=", sub).Order("-Expiry")

	var results []installInfo
	_, err = dsClient.GetAll(ctx, query, &results)
	if err != nil {
		return nil, err
	}

	// grab the first token we see for each connector
	agg := make(map[string]installInfo)
	for _, v := range results {
		_, ok := agg[v.ConnectorName]
		if ok {
			continue
		}
		agg[v.ConnectorName] = v
	}

	return agg, nil
}
