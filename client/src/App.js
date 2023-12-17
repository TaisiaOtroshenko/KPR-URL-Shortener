import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavBar from './component/NavBar'

import Home from './pages/Home'
import Short from './pages/Short'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './pages/Footer'


function App() {
  return (

    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div className="content m-5">
          <Routes>
            <Route  path="/"
              element={
                <div>
                <Home/>
                <Short/>
                <Footer/>
                </div>
              }/>
            
            <Route exact path="/login"
element={
                <div>
                <Login/>
                </div>
              }
    />
            <Route exact path="/register"
                element={
                                <div>
                <Register/>
                                </div>
                              }
                    />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App
