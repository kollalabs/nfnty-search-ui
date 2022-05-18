package api

import (
	"net/http"
	"net/url"
	"os"
	"strings"

	"golang.org/x/oauth2"
)

// CallbackHandler
// https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
// Handles steps 3, 4, and 5 of the Authorization code flow

func CallbackHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		return
	}

	ctx := r.Context()

	// catch any generic errors the auth provider has returned
	errorResponse := r.URL.Query().Get("error")
	if errorResponse != "" {
		msg := errorResponse + " " + r.URL.Query().Get("error_description")
		http.Error(w, msg, http.StatusBadRequest)
		return
	}

	// target is the connector the callback is intended for
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

	// TODO: remove this
	sub := r.URL.Query().Get("sub")
	if sub == "" {
		http.Error(w, "sub is required", http.StatusBadRequest)
		return
	}

	switch cfg.AuthProvider {
	case providerFusebit:
		// handle either oauth callback or fusebit session callback
		sessionID := r.URL.Query().Get("session")
		if sessionID == "" {
			http.Error(w, "session is required", http.StatusBadRequest)
			return
		}
		// handle fusebit session callback
		err := FusebitStartSessionCommit(ctx, sessionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case providerOAuth:
		authorizationCode := r.URL.Query().Get("code")
		if authorizationCode == "" {
			http.Error(w, "code is required", http.StatusBadRequest)
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

		tok := installInfo{
			Token:              resp,
			IDToken:            idToken,
			Scopes:             scopes,
			ConnectorName:      target,
			InfinitySearchUser: sub,
		}

		err = datastoreSaveUserToken(ctx, &tok)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "unknown auth provider "+cfg.AuthProvider, http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "/search?target="+target, http.StatusFound)
}

type installInfo struct {
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
		if scheme == "" {
			scheme = "https"
		}
	}

	u := url.URL{
		Scheme: scheme,
		Host:   r.Host,
		Path:   r.URL.Path,
	}

	return u.String()
}
