package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestInstallURL(t *testing.T) {
	r := httptest.NewRequest(http.MethodGet, "http://infinitysearch.xyz/api/installurl?target=job-nimbus", nil)
	r.AddCookie(&http.Cookie{Name: "sub", Value: "sub_id"})

	cfg := configs["connectors/job-nimbus"]
	cfg.AuthInfo.ClientID = "abc123"

	dst, err := oauthConnectURLWithAuthRedirect(r, cfg)
	if err != nil {
		t.Fatalf("unexpected error: %s\n", err)
	}

	expected := "https://jobnimbus.oidc.kolla.market/oauth2/authorize?audience=https%3A%2F%2Fjobnimbus.data.kolla.dev&client_id=abc123&prompt=consent&redirect_uri=https%3A%2F%2Finfinitysearch.xyz%2Fapi%2Finstallcallback&response_type=code&scope=openid+offline_access+read%3Acontacts+read%3Aschedules&state=auth_provider%3Doauth2%26sub%3Dsub_id%26target%3Dconnectors%252Fjob-nimbus"
	if dst != expected {
		t.Fatalf("unexpected destination\n%s\n%s\n", dst, expected)
	}

}
