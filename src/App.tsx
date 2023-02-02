import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import VimNav from "./components/VimNav";

function App() {
    return (
        <Router>
            <div className="h-full w-full flex flex-col">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/resume" element={<Resume />} />
                </Routes>
                <VimNav />
            </div>
        </Router>
    );
}

export default App;
