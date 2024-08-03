// load data from server with router_Dom
function get_response(response, data) {
  if (response.status === 200) {
    return response.json();
  } else {
    return null + " server has some problem";
  }
}
// load data from server with router_Dom
async function initAnimalsLoader() {
  const animalsFromServer = await fetch(
    "http://localhost:8000/api/v1/animal/animals",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
    .then((response) => get_response(response))
    // .then((data) => setUserData(data))
    .catch((error) => console.error(error));

  console.log(animalsFromServer, " init  animals loader from Loader/loader.js");

  return animalsFromServer;
}

export { initAnimalsLoader };
