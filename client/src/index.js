import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

function SideBars(title){
  return (
    <div>
      <div className = "titleBar">
        <div className= "logo">{"Malignant"}</div>
        <div className = "title">{title}</div>
      </div>
      <div className="box">
        <Link to='/' style={{ textDecoration: 'none' }}><div className= "button">{"About"}</div></Link>
        <Link to='/tambahPenyakit' style={{ textDecoration: 'none' }}><div className= "button">{"Tambah Penyakit"}</div></Link>
        <Link to='/tesDNA' style={{ textDecoration: 'none' }}><div className= "button">{"Tes DNA"}</div></Link>
        <Link to='/riwayatTes' style={{ textDecoration: 'none' }}><div className= "button">{"Riwayat Tes"}</div></Link>
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

class TambahPenyakit extends React.Component{
  render(){
    return(
      <div>
        {SideBars("Tambah Penyakit")}
      </div>
    );
  }
}

class TesDNA extends React.Component{
  constructor(props){
    super(props);
    this.state = {message: ""};
  }
  render(){
    return(
      <div>
        {SideBars("Tes DNA")}
        <button className='helloWorld' onClick={() => this.CallBackend()}>
          {"Hello World!"}
        </button>
        <div className='result'>
          {this.state.message}
        </div>
      </div>
    );
  }
  
  async CallBackend(){
    let Response = await fetch("http://localhost:3001/helloWorld").catch(err => err);
    let Text = await Response.text();
    this.setState({message: Text});

  }
}

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
      <Route path='/tesDNA' element={<TesDNA/>}></Route>
      <Route path='/riwayatTes' element={<RiwayatTes/>}></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);