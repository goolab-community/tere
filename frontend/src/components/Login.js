import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = () => {
    // Send login request to the backend
    axios
      .post("http://localhost:8000/api/v1/auth/login", { login, password })
      .then(function (response) {
        console.log(response);
        console.log(response.data);
        setMessage(response.data.message);
        const { username, email, token, is_active, _id } = response.data;
        console.log(response.data);
        console.log(username, email, token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("token", token);
        localStorage.setItem("is_active", is_active);
        localStorage.setItem("_id", _id);
        // Redirect to homepage using navigate
        navigate("/"); // Replace '/' with the homepage URL if needed
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
        setMessage("Error logging in. Please try again.");
      });
  };
  return (
    // <div style={{"width": "500px", "margin-left": "10%", "margin-top": "100px"}}>
    //   <header>
    //     <h4>Login</h4>
    //   </header>
    //   <Form>
    //     <Form.Group className="mb-3" controlId="formBasicEmail">
    //       <Form.Control type="email" placeholder="Email" value={login} onChange={(e) => setLogin(e.target.value)} />
    //     </Form.Group>
    //     <Form.Group className="mb-3" controlId="formBasicPassword">
    //       <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //     </Form.Group>
    //     {/*
    //     <Form.Group className="mb-3" controlId="formBasicCheckbox">
    //       <Form.Check type="checkbox" label="Check me out" />
    //     </Form.Group>
    //     */}
    //     <Button variant="primary" type="submit" onClick={handleLogin}>
    //       Submit
    //     </Button>
    //     <Form.Label>{message && <p>{message}</p>}</Form.Label>
    //   </Form>
    // </div>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mt-52">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
