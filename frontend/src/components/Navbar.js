import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "../css/navbar.css";

function SiteNavbar() {
  const [user, setuser] = useState(true);

  function logout() {
    console.log("logout");
    localStorage.clear();
    window.location.href = "/";
  }

  // const links = localStorage.getItem("token") ?
  //   [<Nav.Link key="logout" href="/logout" onClick={logout} >Logout</Nav.Link>]:
  //   [<Nav.Link key="login" href="/login">login</Nav.Link>,
  //   <Nav.Link key="register" href="/register">Register</Nav.Link>];

  //   const navs = localStorage.getItem("token") ?
  //   [<Nav.Link key="logout" href="/logout" onClick={logout} >Logout</Nav.Link>]:
  //   [<Nav.Link key="login" href="/login">login</Nav.Link>,
  //   <Nav.Link key="register" href="/register">Register</Nav.Link>];

  // function MainNavBar(){
  //   if (localStorage.getItem("token")){
  //     return (
  //       <Navbar fixed="top"
  //          style={{"margin-left": "3%", position: "sticky", top: 0}}
  //          className="bg-body-tertiary" bg="light" data-bs-theme="light">
  //           <Navbar.Brand href="/">Map</Navbar.Brand>
  //           <Navbar.Brand href="/animals">Animals</Navbar.Brand>
  //           <Navbar.Brand href="/history">History</Navbar.Brand>
  //           <Nav className="me-auto">
  //             <Nav.Link key="logout" href="/logout" onClick={logout} >Logout</Nav.Link>
  //           </Nav>
  //       </Navbar>);
  //   }else{
  //     return (
  //       <Navbar style={{"margin-left": "3%"}} className="bg-body-tertiary" bg="light" data-bs-theme="light">
  //           <Nav className="me-auto">
  //             <Nav.Link key="login" href="/login">login</Nav.Link>
  //             <Nav.Link key="register" href="/register">Register</Nav.Link>
  //           </Nav>
  //       </Navbar>);
  //   }
  // }

  return (
    // <MainNavBar/>
    <nav class=" font-font1 font-semibold flex items-center flex-wrap bg-indigo-400 pl-4 fixed top-0 w-full h-10 z-50">
      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto ">
        <div class="text-sm lg:flex-grow">
          <a>
            <NavLink
              to={"/"}
              className={({ isActive, isPending }) =>
                isPending ? "nonactive" : isActive ? "active" : ""
              }
            >
              Home
            </NavLink>
          </a>

          {localStorage.token ? (
            <a>
              <NavLink
                onClick={logout}
                to={"/logout"}
                className={({ isActive, isPending }) =>
                  isPending ? "nonactive" : isActive ? "active" : ""
                }
              >
                Log Out
              </NavLink>
            </a>
          ) : (
            <>
              <a>
                <NavLink
                  to={"/login"}
                  className={({ isActive, isPending }) =>
                    isPending ? "nonactive" : isActive ? "active" : ""
                  }
                >
                  Login
                </NavLink>
              </a>

              <a>
                <NavLink
                  to={"/register"}
                  className={({ isActive, isPending }) =>
                    isPending ? "nonactive" : isActive ? "active" : ""
                  }
                >
                  Register
                </NavLink>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default SiteNavbar;

// class="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 no-underline"
