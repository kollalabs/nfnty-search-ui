package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestInstallURL(t *testing.T) {
	r := httptest.NewRequest(http.MethodGet, "http://infinitysearch.xyz/api/installurl?target=job-nimbus", nil)
	r.AddCookie(&http.Cookie{Name: "sub", Value: "sub_id"})

	cfg := configs["job-nimbus"]
	cfg.AuthInfo.ClientID = "abc123"

	dst, err := installURLWithAuthRedirect(r, cfg)
	if err != nil {
		t.Fatalf("unexpected error: %s\n", err)
	}

	expected := "https://k-job-nimbus.us.auth0.com/authorize?audience=https%3A%2F%2Fdata.job-nimbus.program.kolla.dev&client_id=abc123&prompt=consent&redirect_uri=https%3A%2F%2Finfinitysearch.xyz%2Fapi%2Finstallcallback&response_type=code&scope=openid+offline_access+read%3Acontacts+read%3Aschedules"
	if dst != expected {
		t.Fatalf("unexpected destination\n%s\n%s\n", dst, expected)
	}

}
