package api

import (
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/datastore"
	"go.einride.tech/aip/resourceid"
	"google.golang.org/api/option"
)

const datastoreTokenKind = "OAuthToken"

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

func userApps(ctx context.Context, sub string) ([]string, error) {

	dsClient, err := datastoreClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get client: %w", err)
	}

	query := datastore.NewQuery(datastoreTokenKind).Filter("InfinitySearchUser =", sub)

	var results []tokenInfo
	_, err = dsClient.GetAll(ctx, query, &results)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

func saveUserAppToken(ctx context.Context, sub string, t *tokenInfo) error {

	key := resourceid.NewSystemGeneratedBase32()

	// kind, name, parent
	k := datastore.NameKey(datastoreTokenKind, key, nil)

	if _, err := defaultDataStore.client.Put(ctx, k, t); err != nil {
		return err
	}

	return nil
}
