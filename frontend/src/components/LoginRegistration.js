import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const LogReg = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRegister = () => {
    console.log(username, email, password);
    if (location.pathname == "/register") {
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
          // logout();
          navigate("/login");
        })
        .catch((error) => {
          console.error(error);
          setMessage("Error registering. Please try again.");
        });
    } else if (location.pathname == "/login") {
      console.log("log reqqqq");

      // it's name need change to inside backEnd
      const login = email;
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
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mt-52">
          {location.pathname == "/register"
            ? "Registration"
            : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          // action="#"
          // method="POST"
          className="space-y-6"
        >
          {location.pathname == "/register" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Your Name
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  id="name"
                  name="name"
                  type="text"
                  required
                  // autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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
              onClick={handleRegister}
              type="button"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {location.pathname == "/register" ? "Register" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogReg;