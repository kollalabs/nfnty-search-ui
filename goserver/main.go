// go:build local
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/kollalabs/nfnty-search-ui/api"
)

func main() {
	http.DefaultServeMux.HandleFunc("/api/connectors", api.ConnectorsHandler)
	http.DefaultServeMux.HandleFunc("/api/installcallback", api.CallbackHandler)
	http.DefaultServeMux.HandleFunc("/api/installurl", api.InstallURLHandler)
	http.DefaultServeMux.HandleFunc("/api/search", api.SearchHandler)

	fmt.Println("starting server on :3000")
	err := http.ListenAndServe(":3000", http.DefaultServeMux)
	if err != nil {
		log.Fatal(err)
	}
}

// MainHandler is a stub to facilitate Vercel serverless deployment.
func MainHandler(w http.ResponseWriter, r *http.Request) {}
