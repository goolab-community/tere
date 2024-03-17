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

  return (
      <Navbar expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav className="me-auto">
            {links}
          </Nav>
        </Container>
      </Navbar>
  );
}

export default SiteNavbar;
