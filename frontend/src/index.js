import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App, { loader } from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

// routing
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SiteNavbar from "./components/Navbar";
import Home from "./Routes/Home";
import LogReg from "./Routes/LoginRegistration";
import MapPage from "./components/Map";
import Logaut from "./components/Logout";
import ErrorPage from "./components/Error/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SiteNavbar />,
    errorElement: <ErrorPage />,
    loader: loader,
    // action: logoutAction,
    // all children ellement appear under of siteNvabar becouse Outlet from React-router-dom is used inside siteNavbar
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <LogReg />,
      },
      {
        path: "register",
        element: <LogReg />,
      },
    ],
  },
  {
    path: "map",
    element: <MapPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
