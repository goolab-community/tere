import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App, { loader } from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

// routing
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SiteNavbar from "./Routes/Navbar";
import Home from "./Routes/Home";
import LogReg from "./Routes/LoginRegistration";
import MapPage from "./Routes/Map";

import { Animals } from "./Routes/Animals";
// import { initAnimalsLoader } from "./loaders/loader";
import History from "./Routes/History";
import ErrorPage from "./components/Error/error-page";

// load more action

// redux
import { Provider } from "react-redux";
import store from "./redux/store";

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
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "animals",
        element: <Animals />,
      },
      {
        path: "history",
        element: <History />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
