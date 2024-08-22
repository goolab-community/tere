import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// for redux
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/reducers/user";

const LogReg = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // for redux
  const dispatch = useDispatch();

  const api_url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}:` + 
                `${process.env.REACT_APP_BACKEND_API_PORT}${process.env.REACT_APP_BACKEND_API_BASE_URL}`;

  const handleRegisterLogin = () => {
    console.log(username, email, password);
    if (location.pathname == "/register") {
      axios
        .post(`${api_url}/auth/register`, {
          username: username,
          email: email,
          password: password,
        })
        .then((response) => {
          setMessage(response.data.message);
          const { username, email, token } = response.data;

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
        .post(`${api_url}/auth/login`, { login, password })
        .then(function (response) {
          console.log(response);
          console.log(response.data);
          setMessage(response.data.message);
          const { username, email, token, is_active, _id } = response.data;

          // for reduxs state update
          dispatch(updateUser({ _id, token }));

          console.log(username, email, token);
          localStorage.setItem("username", username);
          localStorage.setItem("email", email);
          localStorage.setItem("token", token);
          localStorage.setItem("is_active", is_active);
          localStorage.setItem("_id", _id);
          console.log(localStorage);
          // Redirect to homepage using navigate
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
          setMessage("Error logging in. Please try again.");
        });
    }
  };

  return (
    <div className="flex w-full mt-[--margin-top]   items-center  flex-col justify-center px-6 py-0 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-xl sm:text-2xl font-bold leading-9 tracking-tight ">
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
                className="block text-sm font-medium leading-6 "
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
              className="block text-sm font-medium leading-6 "
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
                className="block text-sm font-medium leading-6 "
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
              onClick={() => handleRegisterLogin()}
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
