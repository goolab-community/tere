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

    <div className="flex  h-screen bg-indigo-300">
      <nav className=" pl-[--pading-left] flex-1 font-font1 font-semibold flex items-center flex-wrap bg-gradient-to-r from-indigo-200 to-indigo-300 fixed top-0 w-full h-10 z-30">
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto ">
          <div className=" font-font1 text-xs sm:text-sm     lg:flex-grow">
            <NavLink
              to={"/"}
              className={`${({ isActive, isPending }) =>
                isPending ? "nonactive" : isActive ? "active" : ""} text-[--a]`}
            >
              Home
            </NavLink>

            {(user.token || localstorage.token) && (
              <>
                <NavLink
                  to={"/map"}
                  className={`${({ isActive, isPending }) =>
                    isPending
                      ? "nonactive"
                      : isActive
                      ? "active"
                      : ""} text-[--a]`}
                >
                  Map
                </NavLink>

                <NavLink
                  to={"/animals"}
                  className={`${({ isActive, isPending }) =>
                    isPending
                      ? "nonactive"
                      : isActive
                      ? "active"
                      : ""} text-[--a]`}
                >
                  Animals
                </NavLink>

                <NavLink
                  to={"/history"}
                  className={`${({ isActive, isPending }) =>
                    isPending
                      ? "nonactive"
                      : isActive
                      ? "active"
                      : ""} text-[--a]`}
                >
                  History
                </NavLink>
              </>
            )}

            {user.token || localstorage.token ? (
              <Logaut />
            ) : (
              <>
                <NavLink
                  to={"/login"}
                  className={`${({ isActive, isPending }) =>
                    isPending
                      ? "nonactive"
                      : isActive
                      ? "active"
                      : ""} text-[--a]`}
                >
                  Login
                </NavLink>

                <NavLink
                  to={"/register"}
                  className={`${({ isActive, isPending }) =>
                    isPending
                      ? "nonactive"
                      : isActive
                      ? "active"
                      : ""} text-[--a]`}
                >
                  Register
                </NavLink>
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
