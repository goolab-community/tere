import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = () => {
    // Send login request to the backend
    axios
      .post("http://localhost:8000/login", { email, password })
      .then(function (response) {
        console.log(response);
        console.log(response.data);
        setMessage(response.data.message);
        const { username, email, token } = response.data;
        console.log(response.data);
        console.log(username, email, token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("token", token);
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
    <div>
      <header><h1>Login</h1></header>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
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
