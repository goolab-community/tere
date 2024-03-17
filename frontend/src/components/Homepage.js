import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Map, Popup, useMap, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Card, } from 'react-bootstrap';
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
  const [activePark, setActivePark] = useState(null);
  const [marker_created, setMarkerCreated] = useState(false);
  const [marker_count, setMarkerCount] = useState(0);

  const position = [45.383321536272049, -75.3372987731628];

  const [markers, setMarkers] = useState({
    "features": [
      {
        "type": "Feature",
        "properties": {
          "PARK_ID": 960,
          "NAME": "Bearbrook Skateboard Park",
          "DESCRIPTIO": "Flat asphalt surface, 5 components"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-75.3372987731628, 45.383321536272049]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "PARK_ID": 1219,
          "NAME": "Bob MacQuarrie Skateboard Park (SK8 Extreme Park)",
          "DESCRIPTIO": "Flat asphalt surface, 10 components, City run learn to skateboard programs, City run skateboard camps in summer"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-75.546518086577947, 45.467134581917357]
        }
      }
    ]
  });

  function create_new_marker(latlng) {
    markers.features.push({
      "type": "Feature",
      "properties": {
        "PARK_ID": 1220,
        "NAME": "New marker",
        "DESCRIPTIO": "Flat asphalt surface, 10 components, City run learn to skateboard programs, City run skateboard camps in summer"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [latlng.lng, latlng.lat]
      }
    });
    setMarkers(markers);
    setMarkerCount(marker_count + 1);
    console.log("Creating new marker at:", latlng);
  }


  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click(e) {
        create_new_marker(e.latlng) //console.log(`click on: ${e.latlng} `) // map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
        console.log("Location found:", e.latlng);
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
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

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [28, 46],
    iconAnchor: [17, 46],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <div>
      {userData && (`Welcome ${username} to the Tere app!`)}
      <h1>Map {markers.features.length} </h1>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{height: "100vh", width: "100vw"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.features.map(park => (
          <Marker
            key={park.properties.PARK_ID}
            position={[
              park.geometry.coordinates[1],
              park.geometry.coordinates[0]
            ]}
            onClick={() => {
              setActivePark(park);
              console.log("Active park:", park);
            }}
            >
            <Popup>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/pit-bull.jpg" />
                <Card.Body>
                  <Card.Title>{park.properties.NAME}</Card.Title>
                  <Card.Text>
                    {park.properties.DESCRIPTIO}
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Popup>
          </Marker>
        ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
export default Homepage;
