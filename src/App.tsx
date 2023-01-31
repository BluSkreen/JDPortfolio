import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import VimNav from "./components/VimNav";

function App() {
    return (
        <Router>
            <div className="h-full w-full flex flex-col">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
                <VimNav />
            </div>
        </Router>
    );
}

export default App;
