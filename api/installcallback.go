package api

import (
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"strings"

	"golang.org/x/oauth2"
)

// CallbackHandler
// https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
// Handles steps 3, 4, and 5 of the Authorization code flow
const (
	userInfoURL = "https://infinitysearch.us.auth0.com/userinfo"

	datastoreProjectID = "infinity-search-339422"
)

var (
	isConfigured = false
	clientID     = os.Getenv("JN_CLIENT_ID")
	clientSecret = os.Getenv("JN_CLIENT_SECRET")
)

func init() {
	if clientID == "" || clientSecret == "" {
		return
	}
	isConfigured = true
}

func CallbackHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	errorResponse := r.URL.Query().Get("error")
	if errorResponse != "" {
		msg := errorResponse + " " + r.URL.Query().Get("error_description")
		http.Error(w, msg, http.StatusOK)
		return
	}

	if !isConfigured {
		http.Error(w, "callback handler is not configured", http.StatusInternalServerError)
		return
	}

	authorizationCode := r.URL.Query().Get("code")
	if authorizationCode == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	target := r.URL.Query().Get("target")
	if target == "" {
		http.Error(w, "target is required", http.StatusBadRequest)
		return
	}

	cfg, ok := configs[target]
	if !ok {
		http.Error(w, "unknown target", http.StatusBadRequest)
		return
	}

	sub := r.URL.Query().Get("sub")
	if sub == "" {
		http.Error(w, "sub is required", http.StatusBadRequest)
		return
	}

	c := cfg.AuthInfo
	c.RedirectURL = reconstructRedirectURI(r)
	resp, err := c.Exchange(ctx, authorizationCode)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	idToken := resp.Extra("id_token").(string)
	scopes := strings.Split(resp.Extra("scope").(string), " ")

	tok := tokenInfo{
		Token:         resp,
		IDToken:       idToken,
		Scopes:        scopes,
		ConnectorName: target,
	}

	err = saveUserAppToken(ctx, sub, &tok)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_ = json.NewEncoder(w).Encode(tok)

}

type tokenInfo struct {
	*oauth2.Token
	IDToken string
	Scopes  []string

	ConnectorName      string
	InfinitySearchUser string
}

func reconstructRedirectURI(r *http.Request) string {
	scheme := r.URL.Scheme
	if scheme == "" {
		scheme = os.Getenv("JN_REDIRECT_URI_SCHEME")
	}

	u := url.URL{
		Scheme: scheme,
		Host:   r.Host,
		Path:   r.URL.Path,
	}

	return u.String()
}
