package main

import (
	"database/sql"
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
)

// Heroku db config
const (
	host     = "ec2-3-224-125-117.compute-1.amazonaws.com"
	port     = 5432
	user     = "zmvyzbndjbyyxm"
	password = "1e764b3f8e53eee89d90c826bdf0aa2c632f95932eef4c5e1dc44ecabc8eb50a"
	dbname   = "detohvn99b0i70"
)

func connect() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=require",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write([]byte("<h1>Backend Server!</h1>"))
}

func helloWorld(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, "hello theree")
}

func main() {
	//port := "3001"
	connect()
	/*
		mux := http.NewServeMux()

		mux.HandleFunc("/", indexHandler)
		mux.HandleFunc("/helloWorld", helloWorld)
		http.ListenAndServe(":"+port, mux)

	*/
}
