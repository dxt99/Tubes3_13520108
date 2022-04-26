import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Button, Form, Table, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import HomeIcon from '@mui/icons-material/Home';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SideBars(title, paragraph){
  return (
    <div>
      <div className = "titleBar">
        <h1 className = "titleHeading mb-3">{title}</h1>
        <p className = "paragraph mb-5">{paragraph}</p>
      </div>
      <div className="box">
        <div className= "logo">{"Malignant"}</div>
        <Link className="sidebarList" to='/' style={{ textDecoration: 'none' }}>
          <div className="sidebarIcon"><HomeIcon/></div>
          <div className="sidebarMenu">{"About"}</div>
        </Link>
        <Link className="sidebarList" to='/tambahPenyakit' style={{ textDecoration: 'none' }}>
          <div className="sidebarIcon"><CoronavirusIcon/></div>
          <div className="sidebarMenu">{"Tambah Penyakit"}</div>
        </Link>
        <Link className="sidebarList" to='/tesDNA' style={{ textDecoration: 'none' }}>
          <div className="sidebarIcon"><ScienceIcon/></div>
          <div className="sidebarMenu">{"Tes DNA"}</div>
        </Link>
        <Link className="sidebarList" to='/riwayatTes' style={{ textDecoration: 'none' }}>
          <div className="sidebarIcon"><HistoryIcon/></div>
          <div className="sidebarMenu">{"Riwayat Tes"}</div>
        </Link>
      </div>
    </div>
  );
}

function Home(){
  return (
    <div>
      {SideBars("Tentang Kami")}
    </div>
  );
}

function TambahPenyakit() {
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState("");

  const {
    register, 
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    const reader = new FileReader();
    var promise = new Promise(function(resolve) { // use promise to wait for DNA text result
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.readAsText(data.DNA[0]);
    });
    promise.then(function(resolvedValue) {
      data["DNA"] = resolvedValue;
      console.log(data);
      axios.post("http://localhost:3001/TambahPenyakit", data).then(response => {
        console.log(response);
        console.log(response.data);
        setItems(response.data);
        setSubmitting(true);
        setLoading(false);      
      });
    });
  }

  return(
    <div>
      {SideBars("Tambahkan DNA Penyakit", `Tambahkan DNA penyakit agar jangkauan tes semakin luas!`)}
      <div className = "form">
        <Form>
          <Form.Group className="mb-5">
            <Form.Label>Nama Penyakit:</Form.Label>
            <Form.Control required type="text" placeholder="Masukkan nama penyakit" {...register("namaPenyakit")}></Form.Control>
            <Form.Label className="mt-3">Unggah file teks rantai DNA:</Form.Label>
            <Form.Control type="file" {...register("DNA")}></Form.Control>
            <Button className="mt-3" 
                    type="submit" 
                    onClick = {handleSubmit(onSubmit)}
                    disabled = {isLoading}>
              {!isLoading ? "Submit" : "Loading..."}
            </Button>
          </Form.Group>  
        </Form>
        { submitting &&
          <Alert variant= {items === "Penyakit berhasil ditambahkan" ? "success" : "danger"}>
            { items }
          </Alert>
        }
      </div>
    </div>
  )
};

function TesDNA() {
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState({});

  const {
    register, 
    handleSubmit
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    const reader = new FileReader();
    var promise = new Promise(function(resolve) { // use promise to wait for DNA text result
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.readAsText(data.DNA[0]);
    });
    promise.then(function(resolvedValue) {
      data["DNA"] = resolvedValue;
      console.log(data);
      axios.post("http://localhost:3001/TesDNA", data).then(response => {
        console.log(response);
        console.log(response.data);
        console.log(typeof(response.data));
        setItems(response.data);
        setSubmitting(true);
        setLoading(false);
      });
    });
  }

  return (
    <div>
      {SideBars("Tes DNA Anda Sekarang!", `Ketika seseorang memiliki kelainan genetik atau DNA,
        misalnya karena penyakit keturunan atau karena faktor lainnya, ia bisa mengalami penyakit
        tertentu. Oleh karena itu, tes DNA penting untuk dilakukan untuk mengetahui struktur genetik di
        dalam tubuh seseorang serta mendeteksi kelainan genetik.`)} 
      <div className = "form">
        <Form>
          <Form.Group className="pb-5">
            <Form.Label>Nama Pengguna:</Form.Label>
            <Form.Control required type="text" placeholder="Masukkan nama pengguna" {...register("namaPengguna")}></Form.Control>
            <Form.Label className="mt-3">Prediksi Penyakit:</Form.Label>
            <Form.Control type="text" placeholder="Masukkan prediksi penyakit" {...register("prediksiPenyakit")}></Form.Control>
            <Form.Label className="mt-3">Pilih algoritma string matching:</Form.Label>
            <Form.Select {...register("algoritma")}>
              <option value="KMP">KMP</option>
              <option value="Boyer-Moore">Boyer-Moore</option>
            </Form.Select>
            <Form.Label className="mt-3">Unggah file teks rantai DNA:</Form.Label>
            <Form.Control type="file" {...register("DNA")}></Form.Control>
            <Button className="mt-3" 
                    type="submit" 
                    onClick = {handleSubmit(onSubmit)}
                    disabled = {isLoading}>
              {!isLoading ? "Submit" : "Loading..."}
            </Button>
          </Form.Group>  
        </Form>
      </div>
      { 
        (submitting && typeof(items) == 'object' &&
        <div className="testResult">
          <Alert className="mb-5" variant="success">
            <Alert.Heading>Tes Anda berhasil!</Alert.Heading>
            <p>
              Terima kasih telah melakukan tes di Malignant. Segera konsultasikan hasil tes
              Anda kepada ahlinya!
            </p>
          </Alert>
          <Table striped hover responsive size="sm">
            <tbody>
              <tr>
                <td className = "fw-bold">Tanggal</td>
                <td>{ items.tanggal }</td>
              </tr>
              <tr>
                <td className = "fw-bold">Pengguna</td>
                <td>{ items.pengguna }</td>
              </tr>
              <tr>
                <td className = "fw-bold">Penyakit</td>
                <td>{ items.penyakit }</td>
              </tr>
              <tr> 
                <td className = "fw-bold">Tingkat Kesamaan</td>
                <td>{ String(items.similarity) + "%" }</td>
              </tr>
              <tr>
                <td className = "fw-bold">Hasil</td>
                <td>{ items.isSakit ? "True" : "False" }</td>
              </tr>
            </tbody>
          </Table>
        </div>) || 
        (submitting && typeof(items) == 'string' &&
        <div className="testResult pb-5">
          <Alert variant="danger">
            <Alert.Heading>Mohon maaf, tes Anda gagal!</Alert.Heading>
            <p>
              { items }
            </p>
          </Alert>
        </div>
        )
      }
    </div>
  )
};

function RiwayatTes() {
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const { 
    register,
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);
    axios.post("http://localhost:3001/RiwayatTes", data).then(response => {
        console.log(response);
        console.log(response.data.result);
        setItems(response.data.result);
        setSubmitting(true);
        setLoading(false);
    })
  }
  return (
    <div>
      {SideBars("Riwayat Tes Anda", `Melihat semua riwayat tes Anda dalam satu genggaman. 
      Segera konsultasikan kepada ahlinya mengenai riwayat tes Anda!`)}
      <div className = "form">
        <Form>
          <Form.Group className="mb-5">
            <Form.Label>Query:</Form.Label>
            <Form.Control required type="text" placeholder="Masukkan query pencarian" {...register("query")}></Form.Control>
            <Button className="mt-3" 
                    type="submit" 
                    onClick = {handleSubmit(onSubmit)}
                    disabled = {isLoading}>
              {!isLoading ? "Submit" : "Loading..."}
            </Button>
          </Form.Group>  
        </Form>
      </div>
      {
        (submitting && items != null &&
        <div className="testResult">
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Penyakit</th>
                <th>Similarity</th>
                <th>Hasil</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => 
                <tr key = {index}>
                  <td>{index + 1}</td>
                  <td>{item.pengguna}</td>
                  <td>{item.penyakit}</td>
                  <td>{String(item.similarity) + "%"}</td>
                  <td>{(item.similarity >= 80) ? "True" : "False"}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>) ||
        (submitting && items == null &&
        <div className="testResult">
          <Alert variant="danger">
            <p className="mb-0">Mohon maaf, riwayat tidak ditemukan!</p>
          </Alert>
        </div>)
      }
    </div>
  );
}

ReactDOM.render (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/tambahPenyakit' element={<TambahPenyakit/>}></Route>
      <Route path='/tesDNA' element={<TesDNA/>}></Route>
      <Route path='/riwayatTes' element={<RiwayatTes/>}></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);