package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type TokenResponse struct {
	Token  string    `json:"token"`
	Expiry time.Time `json:"expiry_time"`
}

// Token returns a Kolla Connect user token
func Token(w http.ResponseWriter, r *http.Request) {
	token, err := consumerToken(r.Context(), r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(token)
}

func consumerToken(ctx context.Context, r *http.Request) (*TokenResponse, error) {
	sub, err := isAuthed(ctx, r)
	if err != nil {
		return nil, err
	}

	consumerTokenRequest := struct {
		ConsumerID string `json:"consumer_id"`
	}{
		ConsumerID: sub,
	}
	b := bytes.NewBuffer(nil)
	err = json.NewEncoder(b).Encode(consumerTokenRequest)
	if err != nil {
		return nil, err
	}

	url := "https://connect.getkolla.com/v1/consumers:consumerToken"
	req, err := http.NewRequest(http.MethodPost, url, b)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", connectAPIKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("unable to load remote credentials code [%d]", resp.StatusCode)
	}

	tokenResponse := TokenResponse{}
	err = json.NewDecoder(resp.Body).Decode(&tokenResponse)
	if err != nil {
		return nil, err
	}

	return &tokenResponse, nil
}
