import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


function get_response(response, data) {
  if (response.status === 200) {
    return response.json();
  } else {
    return null + " user not registered";
  }
}
console.log(process.env);
const api_url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}:` + 
                `${process.env.REACT_APP_BACKEND_API_PORT}${process.env.REACT_APP_BACKEND_API_BASE_URL}`;

console.log(api_url);
export async function loader() {
  const user = await fetch(`${api_url}/auth/user`, {
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
