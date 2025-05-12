import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editStateAction,
  loadStateAction,
} from "../redux/reducers/nessesaryState";
import { loadanimals } from "../redux/reducers/animals";
import { update_markers } from "../redux/reducers/markers";
import $, { data, event } from "jquery";
// import Navbar from "./Navbar";

// edit
import Edit from "../components/Edit/Edit";

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
  gray_icon,
  Defaulticon,
} from "../components/Icons";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import LocationComponent from "../components/LocationComponent";
import { NewAnimal, NewAnimal1 } from "./Animals";
import { SliderWithInputFormControl, uploadFile } from "../components/Utils";
import axios from "axios";

import { redirect, useNavigate } from "react-router-dom";
import { animals } from "../components/PropData";
import Update from "../components/Update/Update";
import CustomerLocation from "../components/CustomerLocation/CustomerLocation";
import {
  editLocationStateAction,
  user_location,
} from "../redux/reducers/userLocation";

import { API_URL } from "../config";

const fileTypes = /image\/(png|jpg|jpeg)/i;

// update modal
function StatusUpdateModal({ handleShow, handleClose, show, animal, edit }) {
  const _edit = useSelector((state) => state.nessesary.edit);
  const dispatch = useDispatch();
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
        console.log(e);
        setFileDataURL(e.target.result);
      };
      reader.readAsDataURL(selected_file);
    }
  });

  async function submit_history(e) {
    console.log(e);
    // handleClose();
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
      media_available: selected_file != null,
      description: event_description,
      date: event_date,
      autocheck: true,
    };

    // const editInfo = {
    //   species: "string",
    //   sex: "string",
    //   breed_id: "string",
    //   tag_id: "string",
    //   rfid_code: "string",
    //   age_year: 0,
    //   age_month: 0,
    //   age_year_from: 0,
    //   age_month_from: 0,
    //   age_year_to: 0,
    //   age_month_to: 0,
    //   name: "string",
    //   description: "string",
    //   medias: [
    //     {
    //       url: "string",
    //       type: "image",
    //       uploaded_by_user_id: 0,
    //       date: "2024-08-06T09:45:40.885Z",
    //       description: "string",
    //       animal_id: 0,
    //     },
    //   ],
    //   latitude: 0,
    //   longitude: 0,
    //   address: "string",
    //   history: [
    //     {
    //       animal_id: animal.id,
    //       history_type: event_type,
    //       user_id: parseInt(localStorage.getItem("_id")),
    //       health_scale: parseInt(health_scale),
    //       description: event_description,
    //       date: event_date,
    //       media_link: "",
    //       autocheck: true,
    //     },
    //   ],
    // };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(`${API_URL}/history/history`, history, config);
      console.log(response);

      if (response.data.upload_url != null && selected_file != null) {
        await uploadFile(selected_file, response.data.upload_url);
        alert("History updated successfully");
      } else {
        alert("History updated without media");
      }

      // Redirect after successful upload
      window.location.href = "/history";
    } catch (error) {
      console.log(history);
      console.error("Error:", error);
      alert("Error updating history");
    }
  }

  return (
    <div>
      {_edit == true && (
        <div>
          <Edit animal_id={animal.id} />
        </div>
      )}

      {_edit == false && (
        <Modal
          // className="mt-36"
          show={!_edit || false}
          fullscreen={true}
          onHide={handleClose}
        >
          <Modal.Header>
            <Modal.Title>
              {" "}
              <p
                className=" cursor-pointer"
                onClick={() => dispatch(editStateAction({ bool: null }))}
              >
                X
              </p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea4"
            >
              <Form.Label>Event Type</Form.Label>
              <Form.Control
                as="select"
                placeholder="Event Type"
                onChange={(e) => {
                  console.log(e);
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
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea2"
            >
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
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea3"
            >
              <Form.Label>Media</Form.Label>
              <Card.Img src={fileDataURL} />
              <Form.Group
                style={{ marginTop: "10px" }}
                controlId="formFile"
                className="mb-3"
              >
                <Form.Control onChange={(e) => file_handler(e)} type="file" />
              </Form.Group>
              <Button
                className="mr-3"
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button variant="primary" onClick={(a) => submit_history(a)}>
                Save Changes
              </Button>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
        // <Update />
      )}
    </div>
  );
}

function MapPage() {
  const [userData, setUserData] = useState(null);
  const [marker_positions, setMarkerPosition] = useState([]);

  // map ref
  // const mapRef = useRef();
  const [mapRef, setMapRef] = useState(null);
  //

  const [activePark, setActivePark] = useState(null);
  const [marker_created, setMarkerCreated] = useState(false);
  const [marker_count, setMarkerCount] = useState(0);
  const [allow_marker_creation, setAllowMarkerCreation] = useState(false);
  const [ghost_markers_show, setGhostMarkersShow] = useState(false);
  const [createAnimalModalShow, setCreateAnimalModalShow] =
    React.useState(false);
  const [selected_marker, setSelectedMarker] = useState(null);

  // modal controls
  const [show, setShow] = useState(false);

  // for edit
  const [edit, setEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // --------------

  const [map, setMap] = useState(null);
  const popupElRef = useRef(null);

  // redux
  const state_location = useSelector((state) => state.user_location);
  const user_token = useSelector((state) => state.user.token);
  const position = [state_location.lat, state_location.lon];
  // console.log("WWWWWWWWW", user_token);
  // const [markers, setMarkers] = useState({"features": animals});
  const [db_animals, setAnimals] = useState([]);
  const [isDomReady, setIsDomReady] = useState(false);
  console.log(db_animals);

  const [selected_animal, setSelectedAnimal] = useState(null);

  //  redux
  const _edit = useSelector((state) => state.nessesary.edit);
  const _load = useSelector((state) => state.nessesary.load);
  console.log(_load);
  const dispatch = useDispatch();

  // dispatch(
  //   editLocationStateAction({
  //     lat: 41.92157741866657,
  //     lon: 45.47760172158832,
  //     defaultZoom: 12,
  //   })
  // );

  // console.log(animals);
  function create_new_marker(latlng) {
    console.log("Creating new marker");
    console.log(latlng);

    if (latlng != null) {
      db_animals.push({
        latitude: latlng.lat,
        longitude: latlng.lng,
      });
    }
    // setAnimals(db_animals);
    setMarkerCount(marker_count + 1);
  }

  function LocationMarker() {
    console.log("make location");
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click(e) {
        if (allow_marker_creation) {
          create_new_marker(e.latlng);
        }
      },
      locationfound(e) {
        if (e.latlng != undefined) {
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
          // console.log("Location found:", e.latlng);
        }
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  function geolocateMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        // alert(`Location found: ${position.coords.latitude}, ${position.coords.longitude}`);
        localStorage.setItem("lat", position.coords.latitude);
        localStorage.setItem("lon", position.coords.longitude);
        dispatch(
          editLocationStateAction({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            defaultZoom: 7.5,
          })
        );
      });
    } else {
      // x.innerHTML = "Geolocation is not supported by this browser.";
      console.log("Geolocation is not supported by this browser.");
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/animal/animals`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnimals(data); // Set animals data
        setIsDomReady(true); // Signal that animals data is ready
      })
      .catch((error) => console.error(error));
  }, []);

  // Execute after DOM is updated with `.nadiri` elements
  useEffect(() => {
    if (!isDomReady) return;

    geolocateMap();
    const icon = document.querySelectorAll(".leaflet-marker-icon");
    const attachDiv = document.querySelectorAll(".nadiri");

    if (attachDiv.length === 0) {
      console.warn(".nadiri elements are not present in the DOM");
      return;
    }

    attachDiv.forEach((item, i) => {
      icon[i].setAttribute("GrabID", item.innerHTML);
      const params = new URLSearchParams({
        animal_id: item.innerHTML,
      });

      icon[i].addEventListener("click", () => {
        fetch(`${API_URL}/animal/animal?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            fetch(`${API_URL}/animal/media/${data.medias[0].id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                let imageElement = document.getElementById(item.innerHTML);
                console.log(data);
                imageElement.setAttribute("src", `${data.media.url || null}`);
              });
          })
          .catch((error) => console.error(error));
      });
    });
  }, [isDomReady, db_animals]);

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

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
      case "gray":
        return gray_icon;
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
    } else if (health_scale === -1) {
      return "gray";
    }
  }

  function set_btn_state(e) {
    console.log("Toggle marker creation");
    setAllowMarkerCreation((prev) => !prev);
    console.log(allow_marker_creation);
    // if (allow_marker_creation) {
    //   console.log("Disable marker creation");
    //   // hide save/cancel buttons
    //   $("#save-marker-btn").hide();
    //   $("#cancel-marker-btn").hide();
    // } else {
    //   console.log("Enable marker creation");
    //   // enable save/cancel buttons
    //   $("#save-marker-btn").show();
    //   $("#cancel-marker-btn").show();
    // }
    // $("#toggle-marker-creation-btn").hide();
  }

  function set_ghost_btn_state(e) {
    setGhostMarkersShow((prev) => !prev);
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
            Add New Animal
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
      </Modal>
    );
  }

  function show_animal_history_modal(animal) {
    console.log("Show animal history modal");
    setSelectedAnimal(animal);
    handleShow();
  }

  let navigate = useNavigate();

  // if (!localStorage.token) {
  //   navigate("/login");
  //   return (
  //     <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-14">
  //       Please login first
  //     </div>
  //   );
  // }

  return (
    <>
      <div className=" mt-[--margin-top]  z-10 relative">
        <StatusUpdateModal
          handleShow={handleShow}
          handleClose={handleClose}
          show={_edit || false}
          animal={selected_animal}
          edit={edit}
        />
        <div>
          <div>
            {user_token && (
              <Button
                id="toggle-marker-creation-btn"
                style={{
                  zIndex: 10000,
                  marginBottom: "70px",
                  marginLeft: "10px",
                }}
                className="btn-sm btn-danger position-absolute bottom-0 start-0"
                value="disabled"
                onClick={(e) => {
                  set_btn_state(e);
                }}
                title={allow_marker_creation ? "Disable marker creation" : "Enable marker creation"}
              >
                {allow_marker_creation ? "-" : "+"}
              </Button>
            )}

            <Button
              id="toggle-ghost-show-btn"
              style={{
                zIndex: 10000,
                marginBottom: "70px",
                marginLeft: "45px",
              }}
              className="btn-sm btn-info position-absolute bottom-0 start-0"
              value="disabled"
              onClick={(e) => {
                set_ghost_btn_state(e);
              }}
              title={ghost_markers_show ? "Hide ghost animals": "Show ghost animals"}
            >
              {ghost_markers_show ? "-" : "+"}
            </Button>
            <Button
              id="cancel-marker-btn"
              style={{
                zIndex: 10000,
                marginBottom: "70px",
                marginLeft: "80px",
              }}
              className="btn-sm btn-secondary position-absolute bottom-0 start-0"
              value="disabled"
              onClick={(e) => {
                console.log("Cancel markers creation");
                window.location.reload();
              }}
            >
              Cancel
            </Button>
            {allow_marker_creation && (
              <Button
                id="save-marker-btn"
                style={{
                  zIndex: 10000,
                  marginBottom: "70px",
                  marginLeft: "152px",
                }}
                className="btn-sm btn-primary position-absolute bottom-0 start-0"
              >
                <CustomerLocation mapRefProp={mapRef} />
              </Button>
            )}
          </div>

          <div className="h-[calc(100vh-6rem)] overflow-scroll">
            <MapContainer
              ref={setMapRef}
              // center={[41.92157741866657, 45.47760172158832]}
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
                (animal, i) =>
                  ghost_markers_show | animal.overall_health !== -1 && (
                    <div>
                      <Marker
                        icon={get_icon(health_to_color(animal.overall_health))}
                        key={animal.id}
                        position={[animal.latitude, animal.longitude]}
                        onClick={() => {
                          setActivePark(animal);

                          // console.log("Active marker:", marker);
                          setCreateAnimalModalShow((prev) => !prev);
                        }}
                      >
                        <div className=" invisible nadiri">{animal.id}</div>
                        {!allow_marker_creation ? (
                          // small popup after click location
                          <Popup>
                            <Card
                              style={{
                                width: "15rem",
                                marginTop: "1.5rem",
                                border: "none",
                              }}
                            >
                              <div className=" relative  min-h-40 flex items-center w-full justify-center imagewrapper_loading ">
                                <div
                                  className={` w-48 h-32 flex items-center justify-center ${
                                    !_load ? " hidden" : " flex"
                                  } `}
                                >
                                  <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <svg
                                      aria-hidden="true"
                                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 "
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <img
                                  className={`imagee rounded-md ${
                                    _load ? " invisible" : "visible"
                                  } `}
                                  src={""}
                                  id={animal.id}
                                  alt="Image is not visible"
                                  onClick={(e) => {
                                    console.log("Clicked image");
                                    // open detail animal page
                                    navigate(`/animals/${animal.id}`, {});
                                  }}
                                />
                              </div>

                              <Card.Body className=" ">
                                {/* <Card.Title>{"name " + animal.name}</Card.Title> */}
                                <div className=" font-font1">
                                  <span className=" font-medium">Species:</span>
                                  &nbsp;
                                  <span className=" text-gray-600">
                                    {animal.species || "Not Known"}
                                  </span>
                                </div>
                                <div className=" font-font1">
                                  <span className=" font-medium">Name: </span>
                                  &nbsp;
                                  <span className=" text-gray-600">
                                    {animal.name || "Not Known"}
                                  </span>
                                </div>
                                <div className=" font-font1">
                                  <span className=" font-medium">Sex: </span>
                                  &nbsp;
                                  <span className=" text-gray-600">
                                    {animal.sex || "Not Known"}
                                  </span>
                                </div>
                                <div className=" font-font1">
                                  <span className=" font-medium">
                                    Rfid_code:
                                  </span>
                                  &nbsp;
                                  <span className=" text-gray-600">
                                    {animal.rfid_code || "Not Known"}
                                  </span>
                                </div>
                                <div className=" font-font1">
                                  <span className=" font-medium">Tag_id:</span>
                                  &nbsp;
                                  <span className=" text-gray-600">
                                    {animal.tag_id || "Not Known"}
                                  </span>
                                </div>
                                <div className=" font-font1">
                                  <p className=" font-medium">Description:</p>
                                  <p className=" text-gray-600 mt-1 max-h-14 overflow-y-scroll">
                                    {animal.description ||
                                      "Unfortunately we don't have any description at the moment"}
                                  </p>
                                </div>

                                <div className=" flex gap-3 mt-6">
                                  <Button
                                    variant="primary"
                                    onClick={(e) => {
                                      show_animal_history_modal(animal);
                                      // setEdit(false);
                                      dispatch(
                                        editStateAction({ bool: false })
                                      );
                                    }}
                                  >
                                    Status Update
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={(e) => {
                                      show_animal_history_modal(animal);
                                      // setEdit(true);
                                      dispatch(editStateAction({ bool: true }));
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Popup>
                        ) : (
                          // new animal small popup
                          <NewAnimal
                            marker={animal}
                            createAnimalModalShow={createAnimalModalShow}
                            setSelectedMarker={setSelectedMarker}
                            setCreateAnimalModalShow={setCreateAnimalModalShow}
                          />
                        )}
                      </Marker>
                    </div>
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
