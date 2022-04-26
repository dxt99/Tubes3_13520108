package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

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

func connect() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=require",
		host, port, user, password, dbname)
	newDb, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	err = newDb.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")
	return newDb
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write([]byte("<h1>Backend Server!</h1>"))
}

// POST METHOD:
// nama -> nama penyakit
// DNA -> string DNA
type Insert struct {
	Nama string `json:"namaPenyakit"`
	DNA  string `json:"DNA"`
}

func tambahPenyakit(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.URL.Path != "/TambahPenyakit" {
		fmt.Fprintf(w, "404 not found")
		return
	}

	switch r.Method {
	case "POST":
		var bodyBytes []byte
		if r.Body != nil {
			bodyBytes, _ = ioutil.ReadAll(r.Body)
		}
		// Use the content
		var p Insert
		json.Unmarshal(bodyBytes, &p)
		nama := p.Nama
		DNA := p.DNA

		if len(nama) == 0 {
			fmt.Fprintf(w, "Nama kosong")
			return
		}

		if !IsDNA(DNA) {
			fmt.Fprintf(w, "File tidak berisi DNA")
			return
		}

		//connect to db
		db := connect()
		query := "INSERT INTO public.penyakit (\"NamaPenyakit\", \"DNA\") VALUES ($1, $2)"
		_, err := db.Exec(query, nama, DNA)
		db.Close()
		if err != nil {
			fmt.Fprintf(w, "Penyakit sudah ada")
			return
		}
		fmt.Fprintf(w, "Penyakit berhasil ditambahkan")
		return
	default:
		fmt.Fprintf(w, "Sorry, only POST methods are supported.")
	}
}

// POST METHOD:
// pengguna -> nama pengguna
// nama -> nama penyakit
// DNA -> string DNA
// Metode -> metode pencarian, sementara tidak digunakan
type Form struct {
	NamaPengguna     string `json:"namaPengguna"`
	PrediksiPenyakit string `json:"prediksiPenyakit"`
	Algoritma        string `json:"algoritma"`
	DNA              string `json:"DNA"`
}

type Result struct {
	Tanggal    string `json:"tanggal"`
	Pengguna   string `json:"pengguna"`
	Penyakit   string `json:"penyakit"`
	Similarity int    `json:"similarity"`
	IsSakit    bool   `json:"isSakit"`
}

func tesDNA(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.URL.Path != "/TesDNA" {
		fmt.Fprintf(w, "404 not found")
		return
	}

	switch r.Method {
	case "POST":
		// Read the content

		var bodyBytes []byte
		if r.Body != nil {
			bodyBytes, _ = ioutil.ReadAll(r.Body)
		}
		// Use the content
		var p Form
		json.Unmarshal(bodyBytes, &p)
		pengguna := p.NamaPengguna
		nama := p.PrediksiPenyakit
		DNA := p.DNA
		Algoritma := p.Algoritma

		if len(nama) == 0 {
			fmt.Fprintf(w, "Nama kosong")
			return
		}

		if !IsDNA(DNA) {
			fmt.Fprintf(w, "File tidak berisi DNA")
			return
		}

		// Get DNA File
		db := connect()
		query := "SELECT \"DNA\", \"IDPenyakit\" FROM public.penyakit WHERE \"NamaPenyakit\" = $1"
		rows, err := db.Query(query, nama)
		defer rows.Close()
		defer db.Close()

		if err != nil {
			fmt.Fprintf(w, "Penyakit belum ditambahkan")
			return
		}
		flag := false
		var pattern string
		var IDPenyakit int
		for rows.Next() {
			rows.Scan(&pattern, &IDPenyakit)
			flag = true
		}

		if !flag {
			fmt.Fprintf(w, "Penyakit belum ditambahkan")
			return
		}
		// Check method
		var similarity float64 = 0
		isSame := false
		if Algoritma == "KMP" {
			isSame = KMP(DNA, pattern)
		} else if Algoritma == "Boyer-Moore" {
			isSame = BoyerMoore(DNA, pattern)
		} else {
			fmt.Fprintf(w, "Metode tidak dikenali")
			return
		}

		if !isSame {
			similarity = LCS(DNA, pattern)
		} else {
			similarity = 1
		}

		query = "INSERT INTO public.hasil (\"Tanggal\", \"Pengguna\", \"IDPenyakit\", \"Similarity\") VALUES ($1, $2, $3, $4)"
		_, err = db.Exec(query, time.Now().Format("2006-01-02"), pengguna, IDPenyakit, similarity)
		if err != nil {
			fmt.Fprintf(w, "Unknown Error")
			return
		}

		// Send result
		var result Result
		result.Tanggal = time.Now().Format("2006-01-02")
		result.Pengguna = pengguna
		result.Penyakit = nama
		result.Similarity = int(similarity * 100)
		result.IsSakit = false
		if result.Similarity >= 80 {
			result.IsSakit = true
		}
		encJson, _ := json.Marshal(result)
		fmt.Fprint(w, string(encJson))
		return
	}
}

// POST METHOD:
// Query -> string query
type Query struct {
	Query string `json:"query"`
}

type ResultArray struct {
	Result []Result `json:"result"`
}

func riwayatTes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.URL.Path != "/RiwayatTes" {
		fmt.Fprintf(w, "404 not found")
		return
	}

	switch r.Method {
	case "POST":
		// Read the content

		var bodyBytes []byte
		if r.Body != nil {
			bodyBytes, _ = ioutil.ReadAll(r.Body)
		}
		// Use the content
		var p Query
		json.Unmarshal(bodyBytes, &p)
		query := p.Query
		date, name := querySplit(query)
		t, _ := time.Parse("02-01-2006", date)
		date = t.Format("2006-01-02")
		name = "%" + name + "%"
		// query
		db := connect()
		var rows *sql.Rows
		var err error
		if date == "0001-01-01" {
			query = "SELECT * FROM public.hasil NATURAL JOIN public.penyakit WHERE \"NamaPenyakit\" LIKE $1"
			rows, err = db.Query(query, name)
		} else {
			query = "SELECT * FROM public.hasil NATURAL JOIN public.penyakit WHERE \"NamaPenyakit\" LIKE $2 AND \"Tanggal\" = $1"
			rows, err = db.Query(query, date, name)
		}
		defer rows.Close()
		defer db.Close()
		var result ResultArray
		if err != nil {
			return
		}
		for rows.Next() {
			var temp Result
			var IDPenyakit int
			var IDHasil int
			var DNA string
			var tempSimilarity float64
			rows.Scan(&IDPenyakit, &IDHasil, &(temp.Tanggal), &(temp.Pengguna), &(tempSimilarity), &(temp.Penyakit), &(DNA))
			temp.Similarity = int(tempSimilarity * 100)
			temp.IsSakit = false
			if temp.Similarity >= 80 {
				temp.IsSakit = true
			}
			t, _ := time.Parse("2006-01-02T15:04:05Z", temp.Tanggal)
			temp.Tanggal = t.Format("2006-01-02")
			result.Result = append(result.Result, temp)
		}

		encJson, _ := json.Marshal(result)
		fmt.Fprint(w, string(encJson))
		return
	}
}

func main() {
	port := "3001"
	mux := http.NewServeMux()
	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/TambahPenyakit", tambahPenyakit)
	mux.HandleFunc("/TesDNA", tesDNA)
	mux.HandleFunc("/RiwayatTes", riwayatTes)
	http.ListenAndServe(":"+port, mux)
}
