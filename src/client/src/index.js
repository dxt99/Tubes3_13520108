import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Button, Form, Table, Alert, Spinner, ListGroup } from 'react-bootstrap';
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
        <p className = "paragraph">{paragraph}</p>
      </div>
      <div className="box">
        <div className= "logo">{"Malignant"}</div>
        <Link className="sidebarList" to='/' style={{ textDecoration: 'none' }}>
          <div className="sidebarIcon"><HomeIcon/></div>
          <div className="sidebarMenu">{"Home"}</div>
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
      <div>
      {SideBars("Selamat Datang di Malignant!", `
      Website ini dibuat dalam rangka memenuhi tugas mata kuliah IF2211 Strategi Algoritma yang
      berjudul "Penerapan String Matching dan Regular Expression dalam
      DNA Pattern Matching". Pada website ini, Anda bisa melakukan deteksi penyakit berdasarkan file teks
      yang berisi rantai DNA. Deteksi tersebut berdasarkan pattern matching menggunakan algoritma
      pencocokan string KMP dan Booyer-Moore.
      `)}
      </div>
      <div className="spacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer1.svg'})` 
      }}></div>
      <div className="form">
      <h3 className="text-white pb-2">Created by:</h3>
      <ListGroup as="ol" numbered>
        <ListGroup.Item variant="success">13520108 - Muhammad Rakha Athaya</ListGroup.Item>
        <ListGroup.Item variant="success">13520118 - Mohamad Daffa Argakoesoemah</ListGroup.Item>
        <ListGroup.Item variant="success">13520163 - Frederik Imanuel Louis</ListGroup.Item>
      </ListGroup>
      </div>
      <div className="bottomSpacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer3.svg'})` 
      }}></div>
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
      axios.post("https://malignantdb.herokuapp.com/TambahPenyakit", data).then(response => {
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
      <div className="spacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer1.svg'})` 
      }}></div>
      <div className = "form">
        <Form>
          <Form.Group className="pb-5">
            <Form.Label className="text-white fw-bold">Nama Penyakit:</Form.Label>
            <Form.Control required type="text" placeholder="Masukkan nama penyakit" {...register("namaPenyakit")}></Form.Control>
            <Form.Label className="mt-3 text-white fw-bold">Unggah file teks rantai DNA:</Form.Label>
            <Form.Control type="file" {...register("DNA")}></Form.Control>
            <Button className="mt-3" 
                    type="submit" 
                    onClick = {handleSubmit(onSubmit)}
                    disabled = {isLoading}
                    variant = "success">
              {(isLoading &&
              <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />)
              || (!isLoading && "Submit")}
            </Button>
          </Form.Group>  
        </Form>
        { submitting &&
          <Alert className="mb-0" variant= {items === "Penyakit berhasil ditambahkan" ? "success" : "danger"}>
            { items }
          </Alert>
        }
      </div>
      <div className="bottomSpacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer3.svg'})` 
      }}></div>  
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
      axios.post("https://malignantdb.herokuapp.com/TesDNA", data).then(response => {
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
    <div >
      {SideBars("Tes DNA Anda Sekarang!", `Ketika seseorang memiliki kelainan genetik atau DNA,
        misalnya karena penyakit keturunan atau karena faktor lainnya, ia bisa mengalami penyakit
        tertentu. Oleh karena itu, tes DNA penting untuk dilakukan untuk mengetahui struktur genetik di
        dalam tubuh seseorang serta mendeteksi kelainan genetik.`)} 
      <div className="spacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer1.svg'})` 
      }}></div>
      <div className="form">
        <Form>
          <Form.Group className="pb-5">
            <Form.Label className="text-white fw-bold">Nama Pengguna:</Form.Label>
            <Form.Control required type="text" placeholder="Masukkan nama pengguna" {...register("namaPengguna")}></Form.Control>
            <Form.Label className="mt-3 text-white fw-bold">Prediksi Penyakit:</Form.Label>
            <Form.Control type="text" placeholder="Masukkan prediksi penyakit" {...register("prediksiPenyakit")}></Form.Control>
            <Form.Label className="mt-3 text-white fw-bold">Pilih algoritma string matching:</Form.Label>
            <Form.Select {...register("algoritma")}>
              <option value="KMP">KMP</option>
              <option value="Boyer-Moore">Boyer-Moore</option>
            </Form.Select>
            <Form.Label className="mt-3 text-white fw-bold">Unggah file teks rantai DNA:</Form.Label>
            <Form.Control type="file" {...register("DNA")}></Form.Control>
            <Button className="mt-3" 
                    type="submit" 
                    onClick = {handleSubmit(onSubmit)}
                    disabled = {isLoading}
                    variant = "success">
              {(isLoading &&
              <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />)
              || (!isLoading && "Submit")}
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
          <Table responsive size="sm">
            <tbody className="text-white">
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
        <div className="testResult pb-1">
          <Alert variant="danger">
            <Alert.Heading>Mohon maaf, tes Anda gagal!</Alert.Heading>
            <p>
              { items }
            </p>
          </Alert>
        </div>
        )
      } 
      <div className="bottomSpacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer3.svg'})` 
      }}></div>  
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
    axios.post("https://malignantdb.herokuapp.com/RiwayatTes", data).then(response => {
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
      <div className="spacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer1.svg'})` 
      }}></div>
      <div className = "form">
        <Form>
          <Form.Group>
            <Form.Label className="text-white fw-bold">Query:</Form.Label>
            <Form.Control required type="text" placeholder="Masukkan query pencarian" {...register("query")}></Form.Control>
            <Form.Text className="text-white">
                Contoh: "18-04-2022 HIV", "18-04-2022", "HIV"
            </Form.Text>
          </Form.Group> 
          <Button className="mt-3" 
                    type="submit" 
                    onClick = {handleSubmit(onSubmit)}
                    disabled = {isLoading}
                    variant = "success">
              {(isLoading &&
              <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />)
              || (!isLoading && "Submit")}
            </Button> 
        </Form>
      </div>
      {
        (submitting && items != null &&
        <div className="testResult pt-5">
          <Table className="mb-0 pb-5 text-white" responsive size="sm">
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
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
                  <td>{item.tanggal}</td>
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
        <div className="testResult pt-5">
          <Alert className="mb-0" variant="danger">
            <p className="mb-0">Mohon maaf, riwayat tidak ditemukan!</p>
          </Alert>
        </div>)
      }
      <div className="bottomSpacer" style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/layer3.svg'})` 
      }}></div>  
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