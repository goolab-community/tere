import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function Register() {

  function logout() {
    console.log("logout");
    localStorage.clear();
    window.location.href = '/';
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const handleRegister = () => {
    // Send registration request to the backend
    console.log("Registering...");
    console.log(username, email, password);
    axios
      .post("http://localhost:8000/api/v1/auth/register", { 
        "username": username,
        "email": email,
        "password": password,
      })
      .then((response) => {
        setMessage(response.data.message);
        const { username, email, token } = response.data;
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("token", token);
        // Redirect to homepage using navigate
        //navigate("/"); // Replace '/' with the homepage URL if needed
        //logout();
        alert("Registration successful. Please login to continue.");
        logout();
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Error registering. Please try again.");
      });
  };
  return (
    <div>
      <header><h1>Register</h1></header>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="Enter User Name" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="button" onClick={handleRegister}>
          Register
        </Button>
        <Form.Label>{message && <p>{message}</p>}</Form.Label>
      </Form>
    </div>
  );
}
export default Register;