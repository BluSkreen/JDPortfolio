import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Navbar from './components/Navbar';
import VimNav from './components/VimNav';

function App() {

  return (
    <Router>
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
            <VimNav />
        </>
    </Router>
  )
}

export default App
