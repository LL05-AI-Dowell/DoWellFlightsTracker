import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../ContextApi/ContextApi";
import { AnimatePresence, motion } from "framer-motion";
import LocationSelector from "./LocationSelector";
import { IoClose } from "react-icons/io5";

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

   const [showLocationSelector, setShowLocationSelector] = useState(false);
   const handleSearchedLocationClick = () => {
    setShowLocationSelector(true);

  };

  const isCurrentLocation =
    latitude === searchedLatitude && longitude === searchedLongitude;

  return (
    <div className="absolute flex justify-center gap-5 max-sm:gap-1 w-[100%] pt-2 px-2 h-[100px] text-black z-[2]">
      <AnimatePresence>
        {showLocationSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-[12vh] z-[9999] w-[80%] p-4 rounded-lg bg-white shadow-xl"
          >
            <div className="flex justify-center mb-2">
              <button onClick={() => setShowLocationSelector(false)}>
                <IoClose className="text-2xl" />
              </button>
            </div>
            <LocationSelector setShowLocationSelector={setShowLocationSelector} />
          </motion.div>
        )}
      </AnimatePresence>

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
            <span className="font-normal">
              {currentLatitude?.toFixed(4) || "laoding.."}
            </span>
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
