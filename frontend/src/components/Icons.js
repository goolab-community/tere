import L from 'leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import red_icon_image from '../assets/icons/marker-red-icon.png';
import yellow_icon_image from '../assets/icons/marker-yellow-icon.png';
import blue_icon_image from '../assets/icons/marker-blue-icon.png';
import green_icon_image from '../assets/icons//marker-green-icon.png';


const red_icon = L.icon({
    iconUrl: red_icon_image,
    shadowUrl: iconShadow,
    iconSize: [28, 46],
    iconAnchor: [17, 46],
  });

const yellow_icon = L.icon({
  iconUrl: yellow_icon_image,
  shadowUrl: iconShadow,
  iconSize: [28, 46],
  iconAnchor: [17, 46],
});
const blue_icon = L.icon({
  iconUrl: blue_icon_image,
  shadowUrl: iconShadow,
  iconSize: [28, 46],
  iconAnchor: [17, 46],
});
const green_icon = L.icon({
  iconUrl: green_icon_image,
  shadowUrl: iconShadow,
  iconSize: [28, 46],
  iconAnchor: [17, 46],
});
const Defaulticon = L.icon({
  iconUrl: red_icon_image,
  shadowUrl: iconShadow,
  iconSize: [28, 46],
  iconAnchor: [17, 46],
});

export {red_icon, green_icon, blue_icon, yellow_icon, Defaulticon}