import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Navbar from "../Navbar/Navbar";
import Products from "../Products/Products";
import Stocks from "../Stocks/Stocks";

function App() {
    return (
        <div className="App min-w-full min-h-screen bg-slate-800 text-white">
            <Router>
                <Navbar />
                <div className="container mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<Products />} />
                        <Route path="/stocks" element={<Stocks />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;