# Tugas Besar 3 Strategi Algoritma: String Matching DNA

Aplikasi string matching DNA bernama Malignant dibuat dalam bentuk website yang dapat diakses pada https://malignant.netlify.app. Website memilki fitur tes DNA dimana pengguna dapat mengetes DNAnya dengan salah satu dari penyakit yang ada di database malignant. Penyakit dapat pula ditambahkan dengan fitur tambah penyakit, dan seluruh hasil tes dapat dilihat pada menu riwayat tes.

Website ini dibuat oleh:
- Muhammad Rakha Athaya
- Mohamad Daffa Argakoesoemah
- Frederik Imanuel Louis
## Requirement Program

### Frontend
```
  - Node.js
```
### Backend
```
  - Go
```
### Database
```
  - PostgreSQL
```
## Cara Penggunaan

Cara penggunaan ini merinci cara menjalankan frontend dan backend pada localhost. Langkah-langkah ini tidak diperlukan untuk mengakses website yang sudah dideploy. Perlu dicatat bahwa **frontend telah dikonfigurasi untuk berhubungan dengan backend pada server heroku**, bukan backend pada localhost. Demikian juga **backend telah dikonfigurasi untuk berhubungan dengan database PostgreSQL pada server heroku**.
### Frontend
Pada direktori utama repositori, jalankan:
```
 $cd src/client
 $npm install
 $npm start
```
Frontend dapat dilihat pada localhost:3000
### Backend
Pada direktori utama repositori, jalankan:
```
 $cd src/app
 $go get .
 $go run .
```
Backend akan berjalan pada localhost:3001

### Database
Pada PostgreSQL CLI, dapat dibuat skema database Malignant dengan menjalankan:
```
 $\i test/seed-reset.sql
```
Pengetahuan awal database Malignant juga dapat dimasukkan dengan menjalankan:
```
 $\i test/seed-penyakit.sql
```

## Seed Penyakit
Pada folder test, tercantum beberapa pengetahuan awal yang dimiliki oleh database. File .txt berisi raw data DNA yang tersimpan di database, dan file .sql berisi script PostgreSQL yang dapat digunakan admin database untuk dengan cepat merubah isi database.