import React, { useContext, useEffect } from "react";
import { AppContext } from "../../ContextApi/ContextApi";
import { motion } from "framer-motion";

const LocationToggle = ({ getCurrentLocation }) => {
  const {
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    searchedLatitude,
    searchedLongitude,
    setSearchedLatitude,
    setSearchedLongitude,
    currentLatitude,
    currentLongitude,
  } = useContext(AppContext);

  const handleCurrentLocationClick = () => {
    getCurrentLocation();
  };

  useEffect(() => {
    if (searchedLatitude && searchedLongitude) {
      setLatitude(searchedLatitude);
      setLongitude(searchedLongitude);
    }
  }, [searchedLatitude, searchedLongitude]);

  const handleSearchedLocationClick = () => {
    setSearchedLatitude(33.6);
    setSearchedLongitude(77.6);
  };

  const isCurrentLocation =
    latitude === searchedLatitude && longitude === searchedLongitude;

  return (
    <div className="absolute flex justify-center gap-5 max-sm:gap-1 w-[100%] pt-2 px-2 h-[100px] text-black z-[2]">
      <motion.div
        whileTap={{ scale: 0.93 }}
        className="font-semibold border-[1.2px] border-blue-950 w-[150px] h-fit p-2 rounded-lg bg-white text-xs flex cursor-pointer"
        onClick={handleCurrentLocationClick}
      >
        <div className="w-[15%]">
          <div
            className={`w-4 h-4 rounded-full border-2 border-blue-950 ${
              !isCurrentLocation ? "bg-blue-950" : ""
            }`}
          ></div>
        </div>
        <div className="w-[85%]">
          <h1>Current Location</h1>
          <h1>
            Lat:{" "}
            <span className="font-normal">{currentLatitude?.toFixed(4) || "laoding.."}</span>
          </h1>
          <h1>
            Long:{" "}
            <span className="font-normal">{currentLongitude?.toFixed(4)}</span>
          </h1>
        </div>
      </motion.div>
      <motion.div
        whileTap={{ scale: 0.93 }}
        className="font-semibold border-[1.2px] border-blue-950 w-[150px] h-fit p-2 rounded-lg bg-white text-xs flex cursor-pointer"
        onClick={handleSearchedLocationClick}
      >
        <div className="w-[15%]">
          <div
            className={`w-4 h-4 rounded-full border-2 border-blue-950 ${
              isCurrentLocation ? "bg-blue-950" : ""
            }`}
          ></div>
        </div>
        <div className="w-[85%]">
          <h1>Selected Location</h1>
          <h1>
            Lat:{" "}
            <span className="font-normal">
              {searchedLatitude?.toFixed(4) || "0.00"}
            </span>
          </h1>
          <h1>
            Long:{" "}
            <span className="font-normal">
              {searchedLongitude?.toFixed(4) || "0.00"}
            </span>
          </h1>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationToggle;
