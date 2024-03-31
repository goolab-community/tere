import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Map from "./components/Map";
import {Animals} from "./components/Animals";
import Navbar from "./components/Navbar";
import History from "./components/History";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container1">
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
