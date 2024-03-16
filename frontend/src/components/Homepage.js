import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Map, Popup, useMap, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


function Homepage() {
  const [userData, setUserData] = useState(null);
  const [marker_positions, setMarkerPosition] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const position = [51.505, -0.09];


  function addMarker(e) {
    console.log(e.latlng);
    const { lat, lng } = e.latlng;
    marker_positions.push([lat, lng]);
    setMarkerPosition(marker_positions);
  }

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        console.log(e.latlng);
        const { lat, lng } = e.latlng;
        console.log(lat, lng);
        console.log(marker_positions);
        // L.marker([lat, lng], { icon }).addTo(map);
        marker_positions.push([lat, lng]);
        setMarkerPosition(marker_positions);
        handleShow();
      }
    });
    return null;
  }

  function BuildMarkers(m_positions) {
    return (
      <div>
        {m_positions.map((position) => 
          () =>{
            console.log("Create marker with:", position);
            const next_marker = <Marker position={position}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            let DefaultIcon = L.icon({
              iconUrl: icon,
              shadowUrl: iconShadow
            });
            next_marker.prototype.options.icon = DefaultIcon;
            return next_marker;
          }
        )}
      </div>
    );
  }

  useEffect(() => {
    // Fetch user data from the API endpoint
    fetch("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error(error));
  }, []);

  function AddNewMarker(show, handleClose) {
    console.log("AddNewMarker", show, handleClose);
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">
            Close
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });
  L.Marker.prototype.options.icon = DefaultIcon;
  //  {marker_positions.map((position) => 

  return (
    <div>
      {userData && (`Welcome ${username} to the Tere app!`)}
      <MapContainer id="map_container" center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup... <br /> Easily customizable.
          </Popup>
        </Marker>
        <MarkerClusterGroup>
          {marker_positions.map((position, idx) =>
            <Marker key={idx} position={position} />
          )}
        </MarkerClusterGroup>
        {/* <BuildMarkers m_positions={marker_positions} /> */}
        <MyComponent />
        {/*<AddNewMarker show={show} handleClose={handleClose} />*/}
      </MapContainer>
    </div>
  );
}
export default Homepage;

let pp = [[ 51.49901887040356, -0.11003494262695312 ], [ 51.492713457097935, -0.09441375732421875 ], [ 51.49506473014368, -0.07776260375976564 ], [ 51.49431661096613, -0.07810592651367189 ] ];