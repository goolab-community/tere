import React, { useEffect, useState, useRef } from "react";
import $ from 'jquery';

import { MapContainer, TileLayer, Marker, Map, Popup, useMap, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import {Card, } from 'react-bootstrap';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import {red_icon, green_icon, blue_icon, yellow_icon, Defaulticon} from "./Icons" 
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import LocationComponent from './LocationComponent';
import {NewAnimal, NewAnimal1} from './Animals';
import animals from './PropData';
import {SliderWithInputFormControl} from "./Utils";


function MapPage() {
  const [userData, setUserData] = useState(null);
  const [marker_positions, setMarkerPosition] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [activePark, setActivePark] = useState(null);
  const [marker_created, setMarkerCreated] = useState(false);
  const [marker_count, setMarkerCount] = useState(0);
  const [allow_marker_creation, setAllowMarkerCreation] = useState(false);
  const [createAnimalModalShow, setCreateAnimalModalShow] = React.useState(false);
  const [selected_marker, setSelectedMarker] = useState(null);
  
  const [map, setMap] = useState(null);
  const popupElRef = useRef(null);

  const position = [41.799188, 44.797391];
  const [markers, setMarkers] = useState({"features": animals});


  function create_new_marker(latlng) {
    markers.features.push({
      "type": "dog",
      "properties": {
        "id": 963,
        "sex": "male",
        "bread": "Staffordshire Terrier",
        "age": 2,
        "age_guess": "Adult",
        "name": "Buddy",
        "description": "Buddy is a very friendly dog. He loves to play and run around. He is very good with kids and other dogs. He is a very good",
      },
      "media": {
        "photos": [
          "https://s.yimg.com/ny/api/res/1.2/NjTKtW_PpJqHrsAsC4xU9Q--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQzNw--/https://media.zenfs.com/en/pethelpful_915/131119842bdc193910b6291d087884b3"
        ],
        "videos": []
      },
      "geometry": {
        "type": "Point",
        "coordinates": [latlng.lng, latlng.lat]
      },
      "icon_color": "red"
    });
    setMarkers(markers);
    setMarkerCount(marker_count + 1);
  }

  function LocationMarker() {
    const [position, setPosition] = useState(null)
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
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  useEffect(() => {
    $("#save-marker-btn").hide();
    $("#cancel-marker-btn").hide();
    // Fetch user data from the API endpoint
    fetch("http://localhost:8000/api/v1/auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserData(data))
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

  function set_btn_state(e) {
    // console.log(e);
    setAllowMarkerCreation(!allow_marker_creation);
    if (allow_marker_creation) {
      console.log("Disable marker creation");
      // hide save/cancel buttons
      $("#save-marker-btn").hide();
      $("#cancel-marker-btn").hide();
    }else {
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
            Animal Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Description fields</h4>
          <p>
            {props.selected_marker != null && props.selected_marker.properties.description}
          </p>
          <NewAnimal1 marker={props.selected_marker} createAnimalModalShow={createAnimalModalShow}
            setSelectedMarker={null}
          setCreateAnimalModalShow={setCreateAnimalModalShow}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const hideElement = () => {
    if (!popupElRef.current || !map) return;
    popupElRef.current._close();
    // map.closePopup();
  };

  return (
    <div style={{minHeight:"1000px"}}>
      {/*userData && (`Welcome ${username} to the Tere app!`)*/}
      {/*<LocationComponent />*/}
      <Button
          id="toggle-marker-creation-btn"
          style={{zIndex: 1000, "marginBottom": "10px", "marginLeft": "10px"}}
          className="btn-sm btn-danger position-absolute bottom-0 start-0"
          value="disabled"
          onClick={
            (e) => {
              set_btn_state(e);
            }
          }>
          {allow_marker_creation? "-": "+"}
      </Button>
      <Button
          id="save-marker-btn"
          style={{zIndex: 1000, "marginBottom": "10px", "marginLeft": "45px"}}
          className="btn-sm btn-primary position-absolute bottom-0 start-0"
          value="disabled"
          onClick={
            (e) => {
              console.log("Save markers creation");
              setAllowMarkerCreation(false);
              $("#save-marker-btn").hide();
              $("#cancel-marker-btn").hide();
              $("#toggle-marker-creation-btn").show();
            }
          }>
          Save
      </Button>
      <Button
          id="cancel-marker-btn"
          style={{zIndex: 1000, "marginBottom": "10px", "marginLeft": "100px"}}
          className="btn-sm btn-secondary position-absolute bottom-0 start-0"
          value="disabled"
          onClick={
            (e) => {
              console.log("Cancel markers creation");
              setAllowMarkerCreation(false);
              $("#save-marker-btn").hide();
              $("#cancel-marker-btn").hide();
              $("#toggle-marker-creation-btn").show();
            }
          }>
          Cancel
      </Button>

      <MapContainer center={position} zoom={9} scrollWheelZoom={true}
        whenCreated={setMap}
        style={{height: "100vh", width: "100vw"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.features.map(marker => (
          <Marker
            icon={get_icon(marker.icon_color)}
            key={marker.properties.id}
            position={[
              marker.geometry.coordinates[1],
              marker.geometry.coordinates[0]
            ]}
            onClick={() => {
              setActivePark(marker);
              // console.log("Active marker:", marker);
              setCreateAnimalModalShow(true);
            }}
            >
            {! allow_marker_creation ?
              <Popup>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={marker.media.photos[0]} />
                  <Card.Body>
                    <Card.Title>{marker.properties.name}</Card.Title>
                    <Card.Text>
                      {marker.properties.description}
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Card>
              </Popup> :
              <NewAnimal marker={marker} createAnimalModalShow={createAnimalModalShow}
                setSelectedMarker={setSelectedMarker}
                setCreateAnimalModalShow={setCreateAnimalModalShow}/>
            }
          </Marker>
        )
        // --
        )}
        {
          <MyVerticallyCenteredModal selected_marker={selected_marker} show={createAnimalModalShow}
            onHide={() => setCreateAnimalModalShow(false) }/>
        }
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
export default MapPage;
