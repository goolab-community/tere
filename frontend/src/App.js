import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { API_URL } from "./config";

function get_response(response, data) {
  if (response.status === 200) {
    return response.json();
  } else {
    return null + " user not registered";
  }
}

console.log(API_URL);
export async function loader() {
  const user = await fetch(`${API_URL}/auth/user`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => get_response(response))
    // .then((data) => setUserData(data))
    .catch((error) => console.error(error));

  console.log(user);

  return user;
}

function App() {
  return null;
}
export default App;
