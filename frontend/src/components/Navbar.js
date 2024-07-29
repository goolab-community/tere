import React from "react";
import { useState } from "react";
import { Link, NavLink, redirect, Outlet, useLocation } from "react-router-dom";
import Logaut from "./Logout";

import "../css/navbar.css";

function SiteNavbar() {
  const location = useLocation();
  return (
    // <MainNavBar/>
    <>
      <nav class=" font-font1 font-semibold flex items-center flex-wrap bg-indigo-400 pl-4 fixed top-0 w-full h-10 z-30">
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
            {localStorage.token && (
              <a>
                <NavLink
                  to={"/map"}
                  className={({ isActive, isPending }) =>
                    isPending ? "nonactive" : isActive ? "active" : ""
                  }
                >
                  Map
                </NavLink>
              </a>
            )}

            {localStorage.token ? (
              <Logaut />
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
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default SiteNavbar;

// class="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 no-underline"
