import stray_help from "../Images/help_stray_animals.webp";
import tere from "../Images/tere.jpg";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadanimals } from "../redux/reducers/animals";
import { API_URL } from "../config";


// test
import CustomerLocation from "../components/CustomerLocation/CustomerLocation";

const Home = () => {
  const user = useSelector((state) => state.user);
  const animals = useSelector((state) => state.animals[0].allAnimals);
  console.log(user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.token)
      fetch(`${API_URL}/animal/animals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => dispatch(loadanimals({ allAnimals: [...data] })))

        .catch((error) => console.error(error));
  }, []);
  
  return (
    <div class="w3-content" style={{"max-width":"2000px", "margin-top":"35px", "font-family": "'Lato', sans-serif"}}>
      <div className="mySlides w3-display-container w3-center" style={{"display": "block"}}>
        <img src={tere} style={{"width":"100%"}} />
        <div className="w3-display-bottommiddle w3-container w3-text-white w3-padding-32 w3-hide-small">
          <h3>Join the mission!</h3>
          <p><b>Changing the world for strays starts with us. Register, Rescue, Rehome.</b></p>   
        </div>
      </div>
      <div className="w3-container w3-content w3-center w3-padding-64" style={{"max-width":"80%"}} id="band">
        <h2 className="w3-wide">TERE APP</h2>
        <p className="w3-opacity"><i>About</i></p>
        <p className="w3-justify">
        The project started to organize some orders around stray animal rescue and welfare. We see all mess around social network groups, and day to day, it became clear that we need to change something about it. Random people in social networks organize multiple activities, like:
Gathering money to buy food or cover medical expenses, rescue, find and relocate, etcetera. But all this isn't easy to do if you don't have the right tools around your hand. 
  I thought I could do something about it but didn't take a step forward until I met the happiest, kindest, and friendliest dog I had ever seen on the street. When I first saw her, I immediately noticed how social and friendly she was. She even adopted puppies from another dog; I named her Teresa, Tere, in short. Later, I decided to adopt her, and after some time, I started this project with the help of my friends.
 I hope this project impacts lives too dependent on humans to leave and gives you endless loyalty and love.
        </p>

      </div>
    </div>

  );
};

export default Home;
