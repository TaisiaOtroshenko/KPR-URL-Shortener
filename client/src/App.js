import React from 'react'
import {  BrowserRouter as Router, Route, Switch  } from 'react-router-dom'

import NavBar from './component/NavBar'

import Home from './pages/Home'
import Short from './pages/Short'


import './style.css'

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Switch>
          <Route exact path="/">
              <Home/>
              <Short/>
          </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App
