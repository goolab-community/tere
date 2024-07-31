import React from "react";
import { useState } from "react";
import { Link, NavLink, redirect, Outlet, useLocation } from "react-router-dom";
import Logaut from "../components/Logout";

import "../css/navbar.css";

function SiteNavbar() {
  const location = useLocation();
  return (
    // <MainNavBar/>
    // 100& screen
    <div class="flex  h-screen bg-indigo-300">
      <nav class=" pl-[--pading-left] flex-1 font-font1 font-semibold flex items-center flex-wrap bg-gradient-to-r from-indigo-200 to-indigo-300 fixed top-0 w-full h-10 z-30">
        <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto ">
          <div class="text-xs sm:text-sm    lg:flex-grow">
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
              <>
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
                <a>
                  <NavLink
                    to={"/animals"}
                    className={({ isActive, isPending }) =>
                      isPending ? "nonactive" : isActive ? "active" : ""
                    }
                  >
                    Animals
                  </NavLink>
                </a>
                <a>
                  <NavLink
                    to={"/history"}
                    className={({ isActive, isPending }) =>
                      isPending ? "nonactive" : isActive ? "active" : ""
                    }
                  >
                    Hystory
                  </NavLink>
                </a>
              </>
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

      <Outlet />
    </div>
  );
}

export default SiteNavbar;

// class="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 no-underline"
