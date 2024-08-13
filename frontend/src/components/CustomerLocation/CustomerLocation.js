const CustomerLocation = () => {
  const handleClick = () => {
    console.log("give me location");
    getLocation();
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    } else {
      // x.innerHTML = "Geolocation is not supported by this browser.";
      console.log("Geolocation is not supported by this browser.");
    }
  }

  // function showPosition(position) {
  //   console.log(position.coords.latitude, position.coords.longitude);
  // }

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
