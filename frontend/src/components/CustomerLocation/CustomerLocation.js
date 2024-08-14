import { useDispatch, useSelector } from "react-redux";
import { editLocationStateAction } from "../../redux/reducers/userLocation";
import L from "leaflet";
import { useEffect } from "react";

const CustomerLocation = ({ mapRefProp }) => {
  const { lat, lon, defaultZoom } = useSelector((state) => state.user_location);
  const dispatch = useDispatch();

  // mapRefProp.setView(new L.LatLng(lat, lon), 8, {
  //   animate: true,
  //   duration: 3.0,
  // });

  const handleClick = () => {
    console.log("give me location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        dispatch(
          editLocationStateAction({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            defaultZoom: 16,
          })
        );
      });
    } else {
      // x.innerHTML = "Geolocation is not supported by this browser.";
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // bug -> after change route state is same and zoomed without click,
  // need spiner before first location apload due long time
  useEffect(() => {
    mapRefProp.setView(new L.LatLng(lat, lon), defaultZoom, {
      pan: {
        animate: true,
        duration: 1.5,
      },
      zoom: {
        animate: true,
      },
    });
  }, [lat, lon, defaultZoom]);

  return (
    <div className=" flex items-end font-font1 text-xs" onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
      <p>Find Your Current Location</p>
    </div>
  );
};

export default CustomerLocation;
