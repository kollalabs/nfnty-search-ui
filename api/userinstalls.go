package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"cloud.google.com/go/datastore"
	"go.einride.tech/aip/resourceid"
	"golang.org/x/oauth2"
	"golang.org/x/sync/errgroup"
	"google.golang.org/api/option"
)

// manage user installs through one of two strategies
// the first is to self-manage the user tokans and signup process
// the second is to use Fusebit to manage the user tokens and signup process

// placeholder handler for Vercal
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

// userApps returns a list of all of a user's installed connectors, across both
// our own self managed tokens and Fusebit
func userApps(ctx context.Context, sub string) (map[string]installInfo, error) {
	wg := errgroup.Group{}

	grpA := make(map[string]installInfo)
	grpB := make(map[string]installInfo)

	wg.Go(func() error {
		var err error
		grpA, err = datastoreUserApps(ctx, sub)
		if err != nil {
			return err
		}
		return nil
	})
	wg.Go(func() error {
		var err error
		grpB, err = FusebitUserApps(ctx, sub)
		if err != nil {
			return err
		}
		return nil
	})

	err := wg.Wait()
	if err != nil {
		return nil, err
	}

	// merge the results together, prefer fusebit tokens over our own
	// (merge fusebit into group A)
	for k, v := range grpB {
		grpA[k] = v
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

	query := datastore.NewQuery(datastoreTokenKind).Filter("InfinitySearchUser =", sub).Order("-Expiry")

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

func datastoreSaveUserToken(ctx context.Context, t *installInfo) error {

	key := resourceid.NewSystemGeneratedBase32()

	// kind, name, parent
	k := datastore.NameKey(datastoreTokenKind, key, nil)

	if _, err := defaultDataStore.client.Put(ctx, k, t); err != nil {
		return err
	}

	return nil
}

func (i *installInfo) TokenSource(ctx context.Context) (oauth2.TokenSource, error) {
	cfg, ok := configs[i.ConnectorName]
	if !ok {
		return nil, fmt.Errorf("no config for %s", i.ConnectorName)
	}

	tokenSource := cfg.AuthInfo.TokenSource(ctx, i.Token)
	token, err := tokenSource.Token()
	if err != nil {
		return nil, err
	}
	// check if access token or refresh token have been rotated
	if token.RefreshToken != i.RefreshToken || token.AccessToken != i.AccessToken {
		i.AccessToken = token.AccessToken
		i.RefreshToken = token.RefreshToken
		i.Expiry = token.Expiry

		err := datastoreSaveUserToken(ctx, i)
		if err != nil {
			return nil, err
		}
	}

	ts := oauth2.StaticTokenSource(token)

	return ts, nil
}
