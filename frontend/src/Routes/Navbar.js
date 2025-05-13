import React, { useEffect } from "react";
import { useState } from "react";
import { Link, NavLink, redirect, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/reducers/user";

//i need it for ovveride bootstrap variable
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
// //

import { useSelector } from "react-redux";

import Logaut from "../components/Logout";

function SiteNavbar() {
  console.log("navbar");
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const localstorage = localStorage;

  useEffect(() => {
    // if token Update user state from localstorage
    if (localstorage.token) {
      dispatch(
        updateUser({ _id: localstorage._id, token: localstorage.token })
      );
    } else {
      // if not token update again
      dispatch(updateUser({ _id: null, token: null }));
    }
  }, []);

  return (
    // <MainNavBar/>

<div className="min-h-screen bg-stone-100 font-sans">
  <nav className="fixed top-0 left-0 w-full z-30 bg-gradient-to-r from-slate-200 to-slate-400 shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div className="flex space-x-4 text-sm sm:text-base font-semibold text-gray-800">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md hover:bg-slate-300 transition ${
              isActive ? "bg-slate-500 text-white" : "text-gray-800"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/map"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md hover:bg-slate-300 transition ${
              isActive ? "bg-slate-500 text-white" : "text-gray-800"
            }`
          }
        >
          Map
        </NavLink>

        {(user.token || localStorage.token) && (
          <>
            <NavLink
              to="/animals"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md hover:bg-slate-300 transition ${
                  isActive ? "bg-slate-500 text-white" : "text-gray-800"
                }`
              }
            >
              Animals
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md hover:bg-slate-300 transition ${
                  isActive ? "bg-slate-500 text-white" : "text-gray-800"
                }`
              }
            >
              History
            </NavLink>
          </>
        )}

        {user.token || localStorage.token ? (
          <Logaut />
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md hover:bg-slate-300 transition ${
                  isActive ? "bg-slate-500 text-white" : "text-gray-800"
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md hover:bg-slate-300 transition ${
                  isActive ? "bg-slate-500 text-white" : "text-gray-800"
                }`
              }
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </div>
  </nav>

  <div className="pt-0 px-0">
    <Outlet />
  </div>
</div>

  );
}

export default SiteNavbar;
