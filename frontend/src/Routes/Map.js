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
  Defaulticon,
} from "../components/Icons";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import LocationComponent from "../components/LocationComponent";
import { NewAnimal, NewAnimal1 } from "./Animals";
import { SliderWithInputFormControl, uploadFile } from "../components/Utils";
import axios from "axios";

import { redirect, useNavigate } from "react-router-dom";
import { animals } from "../components/PropData";

const fileTypes = /image\/(png|jpg|jpeg)/i;

// update modal
function StatusUpdateModal({ handleShow, handleClose, show, animal, edit }) {
  console.log(edit);
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
        setFileDataURL(e.target.result);
      };
      reader.readAsDataURL(selected_file);
    }
  });

  function submit_history(e) {
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

    axios
      .post("http://localhost:8000/api/v1/history/history", history, config)
      .then((response) => {
        console.log(response);
        uploadFile(selected_file, response.data.upload_url);
        alert("History updated successfully");
        // goto home page
        window.location.href = "/history";
      })
      .catch((error) => {
        console.log(history);
        console.log(error);
        alert("Error updating history");
      });
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
      )}
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

  // for edit
  const [edit, setEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // --------------

  const [map, setMap] = useState(null);
  const popupElRef = useRef(null);

  const position = [41.799188, 44.797391];
  // const [markers, setMarkers] = useState({"features": animals});
  const [db_animals, setAnimals] = useState([]);
  console.log(db_animals);

  const [selected_animal, setSelectedAnimal] = useState(null);

  //  redux
  const _edit = useSelector((state) => state.nessesary.edit);
  const _load = useSelector((state) => state.nessesary.load);
  console.log(_load);
  const dispatch = useDispatch();

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
    console.log("makeeee location");
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

  //  aq moaqvs yvela animali.
  // animalebi unda vanaxo animal routzee wamoghebuli da savaraudod reduxi dagvchirdeba

  useEffect(() => {
    // // Fetch markers from the API endpoint
    let icon;
    fetch("http://localhost:8000/api/v1/animal/animals", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnimals(data);

        // grap marker after render
        icon = document.querySelectorAll(".leaflet-marker-icon");

        // gram hidden div arrai with innerHTM with real animal id from real animals id
        const attachDiv = document.querySelectorAll(".nadiri");

        // iterate one the hidden dives arrray an grab real id
        attachDiv.forEach((item, i) => {
          // attach icons atribute ID  from Hidden div
          icon[i].setAttribute("GrabID", item.innerHTML);
          const params = new URLSearchParams({
            animal_id: item.innerHTML,
          });
          icon[i].addEventListener("click", () => {
            dispatch(loadStateAction({ bool: true }));
            fetch(`http://localhost:8000/api/v1/animal/animal?${params}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
              .then((response) => response.json())
              // .then((data) => console.log(data))
              .then((data) => {
                console.log(data);
                fetch(
                  `http://localhost:8000/api/v1/animal/media/${data.medias[0].id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                  // dispatch(loadStateAction({ bool: true }))
                )
                  .then((response) => response.json())

                  .then((data) => {
                    console.log(data.media.url);

                    let imageElement = document.getElementById(item.innerHTML);
                    imageElement.setAttribute("src", `${data.media.url || ""}`);
                    dispatch(loadStateAction({ bool: null }));
                  });
              });
          });
        });
      })

      .catch((error) => console.error(error));

    // console.log(icon);

    // console.log(markersRef);
  }, []);

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
    console.log("my cklick");
    setAllowMarkerCreation((prev) => !prev);
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
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-14">
        please logi in
      </div>
    );
  }

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
          <div
            className=" h-14   w-full fixed  bottom-0 left-0  content-center
           "
          >
            <div className="bg-indigo-300 pl-3  pt-2 h-full">
              <button
                disabled={allow_marker_creation && true}
                type="button"
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-1 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm px-3 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 w-12"
                onClick={(e) => {
                  set_btn_state(e);
                }}
              >
                {allow_marker_creation ? "-" : "+"}
              </button>

              <button
                type="button"
                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                onClick={(e) => {
                  console.log("Cancel markers creation");

                  window.location.reload();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="h-[calc(100vh-6rem)] overflow-scroll">
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
                (animal, i) => (
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
                                    class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 "
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
                                alt="Doge Image is not uploaded"
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
                                <span className=" font-medium">Rfid_code:</span>
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
                                    dispatch(editStateAction({ bool: false }));
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
