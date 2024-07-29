import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NoAccess from "./components/NoAccess";

import Map from "./components/Map";
import { Animals } from "./components/Animals";
import Navbar from "./components/Navbar";
import History from "./components/History";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { get } from "jquery";

import Home from "./Routes/Home";
import SiteNavbar from "./components/Navbar";
// import LogReg from "./Routes/LoginRegistration";

function get_response(response, data) {
  if (response.status === 200) {
    return response.json();
  } else {
    return null + " user not registered";
  }
}
export async function loader() {
  const user = await fetch("http://localhost:8000/api/v1/auth/user", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => get_response(response))
    // .then((data) => setUserData(data))
    .catch((error) => console.error(error));

  console.log(user);

  return user;
}

function App() {
  return null;
}
export default App;
