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
        "type": "dog",
        "properties": {
          "id": 960,
          "sex": "M",
          "bread": "Pitbull",
          "age": 2,
          "age_guess": "Adult",
          "name": "Buddy",
          "description": "Buddy is a very friendly dog. He loves to play and run around. He is very good with kids and other dogs. He is a very good",
        },
        "media": {
          "photos": [
            "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/pit-bull.jpg"
          ],
          "videos": []
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-44.3372987731628, 41.383321536272049]
        }
      },
      {
        "type": "cat",
        "properties": {
          "id": 961,
          "sex": "F",
          "bread": "british-shorthair",
          "age": 4,
          "age_guess": "Adult",
          "name": "Sassy",
          "description": "Sassy is a very friendly cat. She loves to play and run around. She is very good with kids and other cats. She is a very good",
        },
        "media": {
          "photos": [
            "https://image.petmd.com/files/styles/978x550/public/2023-04/british-shorthair.jpg"
          ],
          "videos": []
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-43.3472987731628, 40.383321536272049]
        }
      },
      {
        "type": "dog",
        "properties": {
          "id": 962,
          "sex": "M",
          "bread": "Poodle",
          "age": 1,
          "age_guess": "Puppy",
          "name": "Max",
          "description": "Max is a very friendly dog. He loves to play and run around. He is very good with kids and other dogs. He is a very good",
        },
        "media": {
          "photos": [
            "https://www.thesprucepets.com/thmb/-Bx_TMMdE_hWd2p2x_zKJlbN-EI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/irish-dog-names-4798912-hero-fedcedd8960f42788c2f58e269952b4a.jpg"
          ],
          "videos": []
        },
        "geometry": {
          "type": "Point",
          "coordinates": [-42.3572987731628, 39.383321536272049]
        }
      },
    ]
  });

  function create_new_marker(latlng) {
    markers.features.push({
      "type": "dog",
      "properties": {
        "id": 963,
        "sex": "M",
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
        {markers.features.map(marker => (
          <Marker
            key={marker.properties.id}
            position={[
              marker.geometry.coordinates[1],
              marker.geometry.coordinates[0]
            ]}
            onClick={() => {
              setActivePark(marker);
              console.log("Active marker:", marker);
            }}
            >
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
            </Popup>
          </Marker>
        ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
export default Homepage;
