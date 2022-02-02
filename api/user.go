package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"cloud.google.com/go/datastore"
	"go.einride.tech/aip/resourceid"
	"google.golang.org/api/option"
)

const (
	userInfoURL = "https://infinitysearch.us.auth0.com/userinfo"

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

func userApps(ctx context.Context, sub string) ([]tokenInfo, error) {

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

	return results, nil
}

func saveUserAppToken(ctx context.Context, t *tokenInfo) error {

	key := resourceid.NewSystemGeneratedBase32()

	// kind, name, parent
	k := datastore.NameKey(datastoreTokenKind, key, nil)

	if _, err := defaultDataStore.client.Put(ctx, k, t); err != nil {
		return err
	}

	return nil
}

// placeholder to make vercel happy
func UserHandler(w http.ResponseWriter, r *http.Request) {

}

// isAuthed returns the subject (userID) if the user is authed
func isAuthed(ctx context.Context, r *http.Request) (string, error) {
	token := tokenFromRequest(r)
	if token == "" {
		return "", nil
	}
	info, err := userInfo(ctx, token)
	if err != nil {
		return "", err
	}
	return info.Sub, nil
}

func tokenFromRequest(r *http.Request) string {
	header := r.Header.Get("Authorization")
	prefix := "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return ""
	}

	return strings.TrimPrefix(header, prefix)
}

type auth0UserInfo struct {
	Sub                 string `json:"sub"`
	Name                string `json:"name"`
	GivenName           string `json:"given_name"`
	FamilyName          string `json:"family_name"`
	MiddleName          string `json:"middle_name"`
	Nickname            string `json:"nickname"`
	PreferredUsername   string `json:"preferred_username"`
	Profile             string `json:"profile"`
	Picture             string `json:"picture"`
	Website             string `json:"website"`
	Email               string `json:"email"`
	EmailVerified       bool   `json:"email_verified"`
	Gender              string `json:"gender"`
	Birthdate           string `json:"birthdate"`
	Zoneinfo            string `json:"zoneinfo"`
	Locale              string `json:"locale"`
	PhoneNumber         string `json:"phone_number"`
	PhoneNumberVerified bool   `json:"phone_number_verified"`
	Address             struct {
		Country string `json:"country"`
	} `json:"address"`
	UpdatedAt string `json:"updated_at"`
}

func userInfo(ctx context.Context, token string) (auth0UserInfo, error) {
	if token == "" {
		return auth0UserInfo{}, fmt.Errorf("no token supplied")
	}

	u := userInfoURL + "?access_token=" + token
	resp, err := http.DefaultClient.Get(u)
	if err != nil {
		return auth0UserInfo{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		b, _ := ioutil.ReadAll(resp.Body)
		return auth0UserInfo{}, fmt.Errorf("invalid response [%d] [%s]", resp.StatusCode, string(b))
	}
	var info auth0UserInfo
	err = json.NewDecoder(resp.Body).Decode(&info)
	if err != nil {
		return auth0UserInfo{}, err
	}
	return info, nil

}
