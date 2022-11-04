// go:build local
package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/kollalabs/nfnty-search-ui/api"
)

func main() {
	http.DefaultServeMux.HandleFunc("/api/connectors", api.ConnectorsHandler)
	http.DefaultServeMux.HandleFunc("/api/installurl", api.InstallURLHandler)
	http.DefaultServeMux.HandleFunc("/api/search", api.SearchHandler)

	if os.Getenv("HTTPS_PROXY") != "" {
		// setup default http client to ignore self-signed certs if we're using a proxy
		http.DefaultClient.Transport = &http.Transport{
			Proxy:           http.ProxyFromEnvironment,
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, // ignore expired SSL certificates
		}
	}

	fmt.Println("starting server on :3000")
	err := http.ListenAndServe(":3000", http.DefaultServeMux)
	if err != nil {
		log.Fatal(err)
	}
}

// MainHandler is a stub to facilitate Vercel serverless deployment.
func MainHandler(w http.ResponseWriter, r *http.Request) {}
