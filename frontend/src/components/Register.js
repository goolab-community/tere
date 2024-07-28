import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Register() {
  function logout() {
    console.log("logout");
    localStorage.clear();
    window.location.href = "/";
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
        username: username,
        email: email,
        password: password,
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
    // <div style={{"width": "500px", "margin-left": "10%", "margin-top": "100px"}}>
    //   <header><h1>Register</h1></header>
    //   <Form>
    //     <Form.Group className="mb-3" controlId="formBasicEmail">
    //       <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //       {/*<Form.Text className="text-muted">
    //         We'll never share your email with anyone else.
    //       </Form.Text>*/}
    //     </Form.Group>
    //     <Form.Group className="mb-3">
    //       <Form.Control type="text" placeholder="User Name" value={username} onChange={(e) => setUsername(e.target.value)} />
    //     </Form.Group>
    //     <Form.Group className="mb-3" controlId="formBasicPassword">
    //       <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //     </Form.Group>
    //     <Button variant="primary" type="button" onClick={handleRegister}>
    //       Register
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
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Your Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                // autoComplete="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>
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
export default Register;
