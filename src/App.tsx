import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import VimNav from "./components/VimNav";

function App() {
    const testing = false;
    return (
        <Router>
            <div className="h-full w-full flex flex-col">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/info" element={<Resume />} />
                </Routes>
                {testing ? <VimNav /> : <></>}
            </div>
        </Router>
    );
}

export default App;
