import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import NoAccess from "./components/NoAccess";
import Register from "./components/Register";
import Map from "./components/Map";
import {Animals} from "./components/Animals";
import Navbar from "./components/Navbar";
import History from "./components/History";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { get } from "jquery";


function App() {
  const [userData, setUserData] = useState(null);

  function get_response(response, data) {
    if (response.status === 200) {
      return response.json();
    }else{
      return null;
    }
  }

  useEffect(() => {
    // Fetch user data from the API endpoint
    fetch("http://localhost:8000/api/v1/auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => get_response(response))
    .then((data) => setUserData(data))
    .catch((error) => console.error(error));
  }, []);

  function RoutesAll() {
    console.log(userData);
    if (userData === null) {
      console.log("User data is null");
      return (
        <Routes>
          <Route path="/" element={<NoAccess />} />
          <Route path="/animals" element={<NoAccess />} />
          <Route path="/history" element={<NoAccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      );
    }else{
      console.log("User data is not null");
      return (
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      );
    }
  }

  function RoutesAll1() {
    console.log(userData);
    if (userData === null) {
      console.log("User data is null");
    }
    return (
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <Router>
      <Navbar style={{position: "absolute", "margin-left": "3%"}}/>
      <div className="container1">
        <RoutesAll />
      </div>
    </Router>
  );
}
export default App;
