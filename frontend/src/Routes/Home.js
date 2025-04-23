import stray_help from "../Images/help_stray_animals.webp";
import tere from "../Images/tere.jpg";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadanimals } from "../redux/reducers/animals";
import { API_URL } from "../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// twitter
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
// github
import { faGithub } from "@fortawesome/free-brands-svg-icons";
// x.com
import { faX } from "@fortawesome/free-brands-svg-icons";
// facebook
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
// instagram
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
// youtube
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
// wordpress
import { faWordpress } from "@fortawesome/free-brands-svg-icons";

import goolab_logo from "../Images/goolab_dark_sm.jpg";

import tati from "../Images/tati-logo-02.svg";

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
    <div>
      <div
        className="w3-content"
        style={{
          "max-width": "2000px",
          "margin-top": "35px",
          "font-family": "'Lato', sans-serif",
        }}
      >
        <div
          className="mySlides w3-display-container w3-center"
          style={{ display: "block" }}
        >
          <img src={tere} style={{ width: "100%" }} />
          <div className="w3-display-bottommiddle w3-container w3-text-white w3-padding-32 w3-hide-small">
            <h3>Join the mission!</h3>
            <p>
              <b>
                Changing the world for strays starts with us. Register, Rescue,
                Rehome.
              </b>
            </p>
          </div>
        </div>
        <div
          className="w3-container w3-content w3-center w3-padding-64"
          style={{ "max-width": "80%" }}
          id="band"
        >
          <h2 className="w3-wide">TERE APP</h2>
          <p className="w3-opacity">
            <i>About</i>
          </p>
          <p className="w3-justify">
            The project started to organize some orders around stray animal
            rescue and welfare. We see all mess around social network groups,
            and day to day, it became clear that we need to change something
            about it. Random people in social networks organize multiple
            activities, like: Gathering money to buy food or cover medical
            expenses, rescue, find and relocate, etcetera. But all this isn't
            easy to do if you don't have the right tools around your hand. I
            thought I could do something about it but didn't take a step forward
            until I met the happiest, kindest, and friendliest dog I had ever
            seen on the street. When I first saw her, I immediately noticed how
            social and friendly she was. She even adopted puppies from another
            dog; I named her Teresa, Tere, in short. Later, I decided to adopt
            her, and after some time, I started this project with the help of my
            friends. I hope this project impacts lives too dependent on humans
            to leave and gives you endless loyalty and love.
          </p>
        </div>
      </div>
      <div className="supporters">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2 className="w3-wide">Supporters</h2>
              <p className="w3-opacity">
                <i>Our supporters</i>
              </p>
              <p className="w3-justify">
                We are grateful to all the supporters who have helped us
                throughout this journey. Your support has made a significant
                difference in the lives of countless animals. We couldn't have
                done it without you. Thank you for being a part of our mission
                to rescue and care for stray animals. Your generosity and
                compassion inspire us every day. Together, we can create a
                brighter future for these animals in need.
              </p>
            </div>
          </div>
          <div className="row" style={{ "margin-bottom": "2rem", "margin-top": "2rem", display: "flex", justifyContent: "space-evenly" }}>
            <div className="col-md-4 text-center">
              <div className="supporter">
                <img
                  src={goolab_logo}
                  alt="Supporter 1"
                  className="img-fluid"
                  style={{ width: "300px",  "margin-left":"3rem", "margin-bottom":"1rem", height: "auto", "border-radius": "50% 50%" }}
                />
                <h3>GooLab</h3>
                <p>
                  Engineering and research lab, which is focused on developing
                  and implementing innovative solutions to solve real-world
                  problems. We are committed to making a positive impact on
                  society and the environment through our work.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="supporter">
                <img
                  src={tati}
                  alt="Supporter 2"
                  className="img-fluid"
                  style={{ width: "300px", "margin-bottom":"1rem", height: "260px" }}
                />
                <h3>TATI</h3>
                <p>
                Group of animal lovers connected to the Caucasus Region for various reasons.
                  In July 2022, they founded the animal welfare organization TATI ("paw" in Georgian).
                Their main motivation is to improve the appalling — 
                and for many Western Europeans almost inconceivable — 
                conditions in which thousands of stray animals live across the Caucasian countries. 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer
        className="footer-07"
        style={{
          "padding-top": "1rem",
          backgroundColor: "lightgray",
          "background-size": "cover",
          "background-position": "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 text-center">
              <p
                className="menu"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2rem",
                }}
              >
                <a href="#">Home</a>
                <a href="https://blog.tereapp.org">Blog</a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contactModal").style.display =
                      "block";
                  }}
                >
                  Contact
                </a>
              </p>
              <div
                id="contactModal"
                style={{
                  display: "none",
                  position: "fixed",
                  zIndex: 1,
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fefefe",
                    margin: "15% auto",
                    padding: "20px",
                    border: "1px solid #888",
                    width: "80%",
                    maxWidth: "500px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#aaa",
                      float: "right",
                      fontSize: "28px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      document.getElementById("contactModal").style.display =
                        "none";
                    }}
                  >
                    &times;
                  </span>
                  <h2>Contact Information</h2>
                  <p>
                    <strong>Address:</strong> Tbilisi, Georgia
                  </p>
                  <p>
                    <strong>Email:</strong> tereappgeo@gmail.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +995 595484224
                  </p>
                </div>
              </div>
              <ul
                className="ftco-footer-social p-0"
                style={{
                  display: "flex",
                  "margin-top": "20px",
                  justifyContent: "center",
                  gap: "1rem",
                  listStyle: "none",
                }}
              >
                <li className="ftco-animate">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Facebook"
                    style={{ color: "inherit" }}
                    onMouseOver={(e) => (e.target.style.color = "#1877F2")}
                    onMouseOut={(e) => (e.target.style.color = "inherit")}
                  >
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      style={{ fontSize: "2rem" }}
                    />
                  </a>
                </li>
                <li className="ftco-animate">
                  <a
                    href="https://www.instagram.com/tereplatform"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Instagram"
                    style={{ color: "inherit" }}
                    onMouseOver={(e) => (e.target.style.color = "#E4405F")}
                    onMouseOut={(e) => (e.target.style.color = "inherit")}
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      style={{ fontSize: "2rem" }}
                    />
                  </a>
                </li>
                <li className="ftco-animate">
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Youtube"
                    style={{ color: "inherit" }}
                    onMouseOver={(e) => (e.target.style.color = "#FF0000")}
                    onMouseOut={(e) => (e.target.style.color = "inherit")}
                  >
                    <FontAwesomeIcon
                      icon={faYoutube}
                      style={{ fontSize: "2rem" }}
                    />
                  </a>
                </li>
                <li className="ftco-animate">
                  <a
                    href="https://blog.tereapp.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Wordpress"
                    style={{ color: "inherit" }}
                    onMouseOver={(e) => (e.target.style.color = "#21759B")}
                    onMouseOut={(e) => (e.target.style.color = "inherit")}
                  >
                    <FontAwesomeIcon
                      icon={faWordpress}
                      style={{ fontSize: "2rem" }}
                    />
                  </a>
                </li>
                <li className="ftco-animate">
                  <a
                    href="https://github.com/goolab-community/tere"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Github"
                    style={{ color: "inherit" }}
                    onMouseOver={(e) => (e.target.style.color = "#333")}
                    onMouseOut={(e) => (e.target.style.color = "inherit")}
                  >
                    <FontAwesomeIcon
                      icon={faGithub}
                      style={{ fontSize: "2rem" }}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12 text-center">
              <p className="copyright">
                2025 All rights reserved |
                <a href="#" target="_blank">
                  GooLab
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
