package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"sync"
	"time"

	"golang.org/x/oauth2"
)

// TokenSourceHandler is a placeholder for Vercel
func TokenSourceHandler(w http.ResponseWriter, r *http.Request) {
}

const expiryOffset = time.Second * 5

// TokenSource loads and manages tokens from Kolla Connect
type TokenSource struct {
	m sync.Mutex

	apiKey string

	connector  string
	consumerID string

	token oauth2.Token
}

// NewTokenSource returns a TokenSource backed by Kolla Connect
func NewTokenSource(ctx context.Context, apiKey string, connector string, consumerID string) (oauth2.TokenSource, error) {
	ts := &TokenSource{
		apiKey:     apiKey,
		connector:  connector,
		consumerID: consumerID,
	}

	return ts, nil
}

// Returns an oauth2 token
func (k *TokenSource) Token() (*oauth2.Token, error) {
	now := time.Now()

	k.m.Lock()
	defer k.m.Unlock()

	if k.token.Expiry.Sub(now) < expiryOffset {
		err := k.refreshToken()
		if err != nil {
			return nil, err
		}
	}

	return &k.token, nil
}

func (k *TokenSource) refreshToken() error {
	// make call to Kolla Connect to load the token
	url := "https://connect.getkolla.com/v1/connectors/" + url.PathEscape(k.connector) + "/linkedaccounts/-:credentials?consumer_id=" + url.QueryEscape(k.consumerID)
	resp, err := http.NewRequest(http.MethodPost, url, nil)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.Response.StatusCode >= 300 {
		return fmt.Errorf("unable to load remote credentials code [%d]", resp.Response.StatusCode)
	}

	var r struct {
		Credentials struct {
			Token  string    `json:"token"`
			Expiry time.Time `json:"expiry_time"`
		} `json:"credentials"`
	}

	err = json.NewDecoder(resp.Body).Decode(&r)
	if err != nil {
		return fmt.Errorf("unable to decode credentials response body: %w", err)
	}

	k.token.AccessToken = r.Credentials.Token
	k.token.Expiry = r.Credentials.Expiry

	return nil
}
