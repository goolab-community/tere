import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';


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
        window.location.href = '/';
      })
      .catch((error) => {
        console.error(error);
        setMessage("Error logging in. Please try again.");
      });
  };
  return (
    <div style={{"width": "500px", "marginLeft": "10%", "marginTop": "100px"}}>
      <header>
        <h4>Login</h4>
      </header>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="email" placeholder="Email" value={login} onChange={(e) => setLogin(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        {/*
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        */}
        <Button variant="primary" type="submit" onClick={handleLogin}>
          Submit
        </Button>
        <Form.Label>{message && <p>{message}</p>}</Form.Label>
      </Form>
    </div>
  );
}

export default Login;
