import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import HomeIcon from '@mui/icons-material/Home';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import 'bootstrap/dist/css/bootstrap.min.css';

function SideBars(title){
  return (
    <div>
      <div className = "titleBar">
        <div className= "logo">{"Malignant"}</div>
        <div className = "title">{title}</div>
      </div>
      <div className="box">
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
      {SideBars("About")}
    </div>
  );
}

function TambahPenyakit() {
  const {
    register, 
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    const reader = new FileReader();
    console.log(data);
    reader.readAsText(data.DNAsequence[0]);
    reader.onload = function(e) {
      var rawLog = reader.result;
    }
  }
  return(
    <div>
      {SideBars("Tambah Penyakit")}
      <div className = "form">
        <Form>
          <Form.Group className="mb-5">
            <Form.Label>Nama Penyakit:</Form.Label>
            <Form.Control required type="text" placeholder="Masukkan nama penyakit" {...register("namaPengguna")}></Form.Control>
            <Form.Label className="mt-3">Unggah file teks rantai DNA:</Form.Label>
            <Form.Control type="file" {...register("DNAsequence")}></Form.Control>
            <Button className="mt-3" type="button" onClick = {handleSubmit(onSubmit)}>Submit</Button>
          </Form.Group>  
        </Form>
      </div>
    </div>
  )
};

function DNAForm() {
  const {
    register, 
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    const reader = new FileReader();
    console.log(data)
    reader.readAsText(data.DNAsequence[0]);
    reader.onload = function(e) {
      var rawLog = reader.result;
    }
    
  }
  return (
    <div>
        {SideBars("Tes DNA")} 
        <div className = "form">
          <Form>
            <Form.Group className="mb-5">
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
              <Form.Control type="file" {...register("DNAsequence")}></Form.Control>
              <Button className="mt-3" type="button" onClick = {handleSubmit(onSubmit)}>Submit</Button>
            </Form.Group>  
          </Form>
        </div>
      </div>
  )
};
  

// class TesDNA extends React.Component{
//   render(){
//     return(
//       <div>
//         {SideBars("Tes DNA")} 
//         <div className = "form">
//           <Form>
//             <Form.Group className="mb-5">
//               <Form.Label>Nama Pengguna:</Form.Label>
//               <Form.Control required type="text" name="namaPengguna" placeholder="Masukkan nama pengguna" ref={register()}></Form.Control>
//               <Form.Label className="mt-3">Prediksi Penyakit:</Form.Label>
//               <Form.Control type="text" name="prediksiPenyakit" placeholder="Masukkan prediksi penyakit" ref={register()}></Form.Control>
//               <Form.Label className="mt-3">Pilih algoritma string matching:</Form.Label>
//               <Form.Select name="algoritma" ref={register()}>
//                 <option value="KMP">KMP</option>
//                 <option value="Boyer-Moore">Boyer-Moore</option>
//               </Form.Select>
//               <Form.Label className="mt-3">Unggah file teks rantai DNA:</Form.Label>
//               <Form.Control type="file" name="teksDNA" ref={register()}></Form.Control>
//               <Button className="mt-3" type="button" onClick = {handleSubmit(onSubmit)}>Submit</Button>
//             </Form.Group>  
//           </Form>
//         </div>
//       </div>

//       // <div>
//       //   {SideBars("Tes DNA")}
//       //   <button className='helloWorld' onClick={() => this.CallBackend()}>
//       //     {"Hello World!"}
//       //   </button>
//       //   <div className='result'>
//       //     {this.state.message}
//       //   </div>
//       // </div>
//     );
//   }
  
//   async CallBackend(){
//     let Response = await fetch("http://localhost:3001/helloWorld").catch(err => err);
//     let Text = await Response.text();
//     this.setState({message: Text});

//   }
// }

class RiwayatTes extends React.Component{
  render(){
    return(
      <div>
        {SideBars("Riwayat Tes")}
      </div>
    );
  }
}

ReactDOM.render (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/tambahPenyakit' element={<TambahPenyakit/>}></Route>
      <Route path='/tesDNA' element={<DNAForm/>}></Route>
      <Route path='/riwayatTes' element={<RiwayatTes/>}></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);