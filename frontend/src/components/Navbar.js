import React from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function SiteNavbar() {

  function logout() {
    console.log("logout");
    localStorage.clear();
    window.location.href = '/';
  }

  const links = localStorage.getItem("token") ?
    [<Nav.Link key="logout" href="/logout" onClick={logout} >Logout</Nav.Link>]:
    [<Nav.Link key="login" href="/login">login</Nav.Link>,
    <Nav.Link key="register" href="/register">Register</Nav.Link>];

    const navs = localStorage.getItem("token") ?
    [<Nav.Link key="logout" href="/logout" onClick={logout} >Logout</Nav.Link>]:
    [<Nav.Link key="login" href="/login">login</Nav.Link>,
    <Nav.Link key="register" href="/register">Register</Nav.Link>];

    function MainNavBar(){
      if (localStorage.getItem("token")){
        return (
          <Navbar fixed="top"
             style={{"margin-left": "3%", position: "sticky", top: 0}} 
             className="bg-body-tertiary" bg="light" data-bs-theme="light">
              <Navbar.Brand href="/">Map</Navbar.Brand>
              <Navbar.Brand href="/animals">Animals</Navbar.Brand>
              <Navbar.Brand href="/history">History</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link key="logout" href="/logout" onClick={logout} >Logout</Nav.Link>
              </Nav>
          </Navbar>);
      }else{
        return (
          <Navbar style={{"margin-left": "3%"}} className="bg-body-tertiary" bg="light" data-bs-theme="light">
              <Nav className="me-auto">
                <Nav.Link key="login" href="/login">login</Nav.Link>
                <Nav.Link key="register" href="/register">Register</Nav.Link>
              </Nav>
          </Navbar>);
      }
    }


  return (
    <MainNavBar/>
  );
}

export default SiteNavbar;
