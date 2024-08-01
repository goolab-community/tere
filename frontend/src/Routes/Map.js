import React, { useEffect, useState, useRef } from "react";

import $, { data, event } from "jquery";
// import Navbar from "./Navbar";

import {
  MapContainer,
  TileLayer,
  Marker,
  Map,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Card, Form } from "react-bootstrap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  red_icon,
  green_icon,
  blue_icon,
  yellow_icon,
  Defaulticon,
} from "../components/Icons";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import LocationComponent from "../components/LocationComponent";
import { NewAnimal, NewAnimal1 } from "./Animals";
import { SliderWithInputFormControl, uploadFile } from "../components/Utils";
import axios from "axios";

import { redirect, useNavigate } from "react-router-dom";

const fileTypes = /image\/(png|jpg|jpeg)/i;

function StatusUpdateModal({ handleShow, handleClose, show, animal }) {
  const [health_scale, setHealthScale] = useState(0);

  const [fileDataURL, setFileDataURL] = useState(null);
  const [selected_file, setSelectedFile] = useState(null);

  const [event_type, setEventType] = useState("feed");
  const [event_date, setEventDate] = useState(null);
  const [event_description, setEventDescription] = useState(null);

  function file_handler(e) {
    console.log(e);
    // get file object
    var file = e.target.files[0];

    if (!file.type.match(fileTypes)) {
      alert("Image mime type is not valid");
      return;
    }
    setSelectedFile(file);
  }

  useEffect(() => {
    if (selected_file !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataURL(e.target.result);
      };
      reader.readAsDataURL(selected_file);
    }
  });

  function submit_history(e) {
    handleClose();
    console.log(
      `------- Submitting history for animal ${animal.name} --------`
    );
    console.log("Event Type:", event_type);
    console.log("Health Scale:", health_scale);
    console.log("Date:", event_date);
    console.log("Description:", event_description);
    console.log("File:", selected_file);
    console.log(
      "-------------------------------------------------------------"
    );
    // make a pos request to the backend
    const history = {
      user_id: parseInt(localStorage.getItem("_id")),
      animal_id: animal.id,
      history_type: event_type,
      health_scale: parseInt(health_scale),
      media_link: "",
      description: event_description,
      date: event_date,
      autocheck: false,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post("http://localhost:8000/api/v1/history/history", history, config)
      .then((response) => {
        console.log(response);
        uploadFile(selected_file, response.data.upload_url);
        alert("History updated successfully");
        // goto home page
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(history);
        console.log(error);
        alert("Error updating history");
      });
  }

  return (
    <div>
      <Modal class="mt-36" show={show} fullscreen={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea4">
            <Form.Label>Event Type</Form.Label>
            <Form.Control
              as="select"
              placeholder="Event Type"
              onChange={(e) => {
                setEventType(e.target.value);
              }}
            >
              <option value={"feed"}>Feed</option>
              <option value={"lost"}>Lost</option>
              <option value={"found"}>Found</option>
              <option value={"sighting"}>Seen</option>
              <option value={"adoption"}>Adopted</option>
              <option value={"death"}>Death</option>
              <option value={"other"}>Other</option>
            </Form.Control>
            <p></p>
            <SliderWithInputFormControl
              id="health_scale"
              name="Health Scale"
              value={health_scale}
              min="0"
              max="10"
              setValue={setHealthScale}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
            <Form.Label>Date</Form.Label>
            <p></p>
            <input
              type="datetime-local"
              id="eventdate"
              name="eventdate"
              onChange={(e) => setEventDate(e.target.value)}
            ></input>
            <p></p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea3">
            <Form.Label>Media</Form.Label>
            <Card.Img src={fileDataURL} />
            <Form.Group
              style={{ marginTop: "10px" }}
              controlId="formFile"
              className="mb-3"
            >
              <Form.Control onChange={(e) => file_handler(e)} type="file" />
            </Form.Group>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(a) => submit_history(a)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function MapPage() {
  const [userData, setUserData] = useState(null);
  const [marker_positions, setMarkerPosition] = useState([]);

  const [activePark, setActivePark] = useState(null);
  const [marker_created, setMarkerCreated] = useState(false);
  const [marker_count, setMarkerCount] = useState(0);
  const [allow_marker_creation, setAllowMarkerCreation] = useState(false);
  const [createAnimalModalShow, setCreateAnimalModalShow] =
    React.useState(false);
  const [selected_marker, setSelectedMarker] = useState(null);

  // modal controls
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // --------------

  const [map, setMap] = useState(null);
  const popupElRef = useRef(null);

  const position = [41.799188, 44.797391];
  // const [markers, setMarkers] = useState({"features": animals});
  const [db_animals, setAnimals] = useState([]);

  const [selected_animal, setSelectedAnimal] = useState(null);

  function create_new_marker(latlng) {
    console.log("Creating new marker");
    console.log(latlng);
    console.log(db_animals);
    if (latlng != null) {
      db_animals.push({
        latitude: latlng.lat,
        longitude: latlng.lng,
      });
    }
    setAnimals(db_animals);
    setMarkerCount(marker_count + 1);
  }

  function set_animals(data) {
    console.log("Setting markers");
    console.log(data);
    setAnimals(data);
    // setMarkers(animals);
  }

  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click(e) {
        if (allow_marker_creation) {
          create_new_marker(e.latlng);
        }
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        // console.log("Location found:", e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  useEffect(() => {
    // $("#save-marker-btn").hide();
    // $("#cancel-marker-btn").hide();
    // // Fetch user data from the API endpoint
    // fetch("http://localhost:8000/api/v1/auth/user", {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // })
    // .then((response) => response.json())
    // .then((data) => setUserData(data))
    // .catch((error) => console.error(error));

    // Fetch markers from the API endpoint
    fetch("http://localhost:8000/api/v1/animal/animals", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => set_animals(data))
      .catch((error) => console.error(error));
  }, []);

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  // const LeafIcon = L.Icon.extend({
  //   options: {}
  // });

  L.Marker.prototype.options.icon = red_icon;

  function get_icon(color) {
    switch (color) {
      case "red":
        return red_icon;
      case "yellow":
        return yellow_icon;
      case "blue":
        return blue_icon;
      case "green":
        return green_icon;
      default:
        return Defaulticon;
    }
  }

  function health_to_color(health_scale) {
    if (health_scale >= 0 && health_scale <= 2) {
      return "red";
    } else if (health_scale > 2 && health_scale <= 4) {
      return "yellow";
    } else if (health_scale > 4 && health_scale <= 7) {
      return "blue";
    } else if (health_scale > 7 && health_scale <= 10) {
      return "green";
    }
  }

  function set_btn_state(e) {
    // console.log(e);
    setAllowMarkerCreation(!allow_marker_creation);
    if (allow_marker_creation) {
      console.log("Disable marker creation");
      // hide save/cancel buttons
      $("#save-marker-btn").hide();
      $("#cancel-marker-btn").hide();
    } else {
      console.log("Enable marker creation");
      // enable save/cancel buttons
      $("#save-marker-btn").show();
      $("#cancel-marker-btn").show();
    }
    $("#toggle-marker-creation-btn").hide();
  }

  function MyVerticallyCenteredModal(props) {
    console.log("Selected marker:", props);
    return (
      <Modal
        {...props}
        id="new-animal-modal"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Animal Form 2
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Description fields</h4>
          {/*<p>
            {props.selected_marker != null && props.selected_marker.properties.description}
          </p>
          */}
          <NewAnimal1
            marker={props.selected_marker}
            createAnimalModalShow={createAnimalModalShow}
            setSelectedMarker={null}
            setCreateAnimalModalShow={setCreateAnimalModalShow}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function show_animal_history_modal(animal) {
    console.log("Show animal history modal");
    setSelectedAnimal(animal);
    handleShow();
  }
  let navigate = useNavigate();
  if (!localStorage.token) {
    navigate("/login");
    return (
      <div class=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-14">
        please logi in
      </div>
    );
  }
  return (
    <>
      <div class=" mt-[--margin-top]  z-10 relative">
        <StatusUpdateModal
          handleShow={handleShow}
          handleClose={handleClose}
          show={show}
          animal={selected_animal}
        />
        <div>
          {/*userData && (`Welcome ${username} to the Tere app!`)*/}
          {/*<LocationComponent />*/}
          <div
            class=" h-14   w-full fixed  bottom-0 left-0  content-center
           "
          >
            <div class="bg-indigo-300 pl-3  pt-2 h-full">
              {/* <Button
                id="toggle-marker-creation-btn"
                style={{ zIndex: 1000 }}
                className="btn-sm btn-danger position-absolute bottom-0 start-0"
                value="disabled"
                onClick={(e) => {
                  set_btn_state(e);
                }}
              >
                {allow_marker_creation ? "-" : "+"}
              </Button>

              <Button
                id="save-marker-btn"
                style={{ zIndex: 1000, marginLeft: "45px" }}
                className="btn-sm btn-primary position-absolute bottom-0 start-0"
                value="disabled"
                onClick={(e) => {
                  console.log("Save markers creation");
                  setAllowMarkerCreation(false);
                  $("#save-marker-btn").hide();
                  $("#cancel-marker-btn").hide();
                  $("#toggle-marker-creation-btn").show();
                }}
              >
                Save
              </Button>
              <Button
                id="cancel-marker-btn"
                style={{
                  zIndex: 1000,

                  marginLeft: "100px",
                }}
                className="btn-sm btn-secondary position-absolute bottom-0 start-0"
                value="disabled"
                onClick={(e) => {
                  console.log("Cancel markers creation");
                  // setAllowMarkerCreation(false);
                  // $("#save-marker-btn").hide();
                  // $("#cancel-marker-btn").hide();
                  // $("#toggle-marker-creation-btn").show();
                  window.location.reload();
                }}
              >
                Cancel
              </Button> */}
              <button
                type="button"
                class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-1 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm px-3 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 w-12"
                onClick={(e) => {
                  set_btn_state(e);
                }}
              >
                {allow_marker_creation ? "-" : "+"}
              </button>
              <button
                type="button"
                class="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900"
                onClick={(e) => {
                  console.log("Save markers creation");
                  setAllowMarkerCreation(false);
                  $("#save-marker-btn").hide();
                  $("#cancel-marker-btn").hide();
                  $("#toggle-marker-creation-btn").show();
                }}
              >
                Save
              </button>
              <button
                type="button"
                class="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                onClick={(e) => {
                  console.log("Cancel markers creation");
                  // setAllowMarkerCreation(false);
                  // $("#save-marker-btn").hide();
                  // $("#cancel-marker-btn").hide();
                  // $("#toggle-marker-creation-btn").show();
                  window.location.reload();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <div class="h-[calc(100vh-6rem)] overflow-scroll">
            <MapContainer
              center={position}
              zoom={7.5}
              scrollWheelZoom={true}
              whenCreated={setMap}
              style={{ height: "100vh", width: "100vw" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {db_animals.map(
                (animal) => (
                  <Marker
                    icon={get_icon(health_to_color(animal.overall_health))}
                    key={animal.id}
                    position={[animal.latitude, animal.longitude]}
                    onClick={() => {
                      setActivePark(animal);
                      // console.log("Active marker:", marker);
                      setCreateAnimalModalShow(true);
                    }}
                  >
                    {!allow_marker_creation ? (
                      <Popup>
                        <Card style={{ width: "18rem" }}>
                          <Card.Img
                            id={"image_" + animal.medias.id}
                            variant="top"
                            src={animal.public_url}
                          />
                          <Card.Body>
                            <Card.Title>{animal.name}</Card.Title>
                            <Card.Text>{animal.description}</Card.Text>
                            <Button
                              variant="primary"
                              onClick={(e) => show_animal_history_modal(animal)}
                            >
                              Status Update
                            </Button>
                          </Card.Body>
                        </Card>
                      </Popup>
                    ) : (
                      <NewAnimal
                        marker={animal}
                        createAnimalModalShow={createAnimalModalShow}
                        setSelectedMarker={setSelectedMarker}
                        setCreateAnimalModalShow={setCreateAnimalModalShow}
                      />
                    )}
                  </Marker>
                )
                // --
              )}
              {
                <MyVerticallyCenteredModal
                  selected_marker={selected_marker}
                  show={createAnimalModalShow}
                  onHide={() => setCreateAnimalModalShow(false)}
                />
              }
              <LocationMarker />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapPage;
