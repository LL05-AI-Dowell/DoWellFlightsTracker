import React, { useContext, useEffect, useState } from "react";
import { easeInOut, motion } from "framer-motion";
import { IoAirplaneSharp } from "react-icons/io5";
import { FaSliders } from "react-icons/fa6";

import { AppContext } from "../../ContextApi/ContextApi";
import toast from "react-hot-toast";
import AirportSearch from "../Components/SearchForm";
import { Navbar } from "../Components/Navbar";
import FlightStatusCard from "../Components/FlightStatusCard"
import { fetchAirportApi } from "../../services/api.config";

const FlightTrackerPage = () => {
  const {
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    airports,
    setAirports,
    loading,
    setloading,
    error,
    setError,
    flightsPerPage,
    setFlightsPerPage,
    searchRadius,
    setSearchRadius,
    currentPage,
    setCurrentPage,
    dateTime,
    setDateTime,
    typeOfStatus,
    setTypeOfStatus,
    selectedAirport,
    setSelectedAirport,
    flights,
    setFlights,
  } = useContext(AppContext);

  

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locationLoading, setlocationLoading] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getCurrentLocation = () => {
    setlocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setlocationLoading(false);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          toast.error(`Error getting location: ${err.message}`);
          setlocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setlocationLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchAirports = async (lat, long) => {
      try {
        setloading(true);

        const res = await fetchAirportApi({
          latitude: lat,
          longitude: long,
          radiusMiles: searchRadius,
        });

        if(res ){
          setAirports(res.response || []);
        }
        
      } catch (err) {
        console.log(`Error fetching airports: ${err.message}`);
      } finally {
        setloading(false);
      }
    };

    if (latitude && longitude) {
      fetchAirports(latitude, longitude);
    }
  }, [latitude, longitude, searchRadius]);

  return (
    <div className="w-full bg-black relative text-xl overflow-hidden px-[5vw] py-[30px] text-white">
      <div
        className="absolute top-[-500px] left-[50%] translate-x-[-50%] h-[700px] z-[0] w-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, #34d399 0%, transparent 60%)",
        }}
      ></div>

      <Navbar />

      <div className="w-full min-h-[80px] mt-[40px] text-xl rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 relative flex justify-between items-center px-[30px] py-[10px]">
        <div>
          <h1 className="font-semibold text-2xl max-sm:text-lg">
            Good Morning, User!
          </h1>
          <h1 className="text-sm opacity-80">Current Location</h1>
          {locationLoading ? (
            <motion.h1
              className="text-sm opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              Searching Location<span className="ml-1">.</span>
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.11,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.33,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.66,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
            </motion.h1>
          ) : (
            <h1 className="text-sm">
              Lat: {latitude?.toFixed(4)} | Long: {longitude?.toFixed(4)}
            </h1>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05, opacity: 0.8 }}
          className="flex justify-center items-center font-semibold w-[200px] h-[50px] bg-[var(--primary-color-green)] rounded-xl"
          onClick={getCurrentLocation} 
        >
          {locationLoading ? (
            <motion.h1
              className="text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              updating Location<span className="ml-1">.</span>
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.11,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.33,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.66,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
            </motion.h1>
          ) : (
            <h1 className="text-base">Update Location</h1>
          )}
        </motion.button>
      </div>

      <AirportSearch />

      <div className="w-full mt-[50px] flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <IoAirplaneSharp className="text-[var(--primary-color-green)] rotate-[-45deg] text-xl" />
          <span className="text-2xl font-semibold">
            Flight Schedule
            <span className="text-sm px-4 text-gray-400">
              Showing {flights.length} flights
            </span>
          </span>
        </div>
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center gap-4">
            <FaSliders />
            All Filters
          </button>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: isDropdownOpen ? 1 : 0,
                y: isDropdownOpen ? 10 : -10,
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, easing: easeInOut }}
              className={`absolute z-[40]  flex flex-col top-full right-0  bg-gradient-to-br from-slate-900 to-slate-800  py-4 px-8 rounded-md shadow-xl ${
                isDropdownOpen ? "block" : "hidden"
              }`}
            >
              <div
                onClick={() => setTypeOfStatus("arr")}
                className={`cursor-pointer w-full text-center p-2 ${
                  typeOfStatus == "arr" && "bg-[var(--primary-color-green)]"
                }  rounded-md mb-3`}
              >
                Arrivals
              </div>
              <div
                onClick={() => setTypeOfStatus("dep")}
                className={`cursor-pointer w-full text-center p-2 ${
                  typeOfStatus == "dep" && "bg-[var(--primary-color-green)]"
                }  rounded-md mb-3`}
              >
                Departures
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {selectedAirport ? (
        flights.length > 0 ? (
          <>
            <div className="w-full  mt-[20px]">
              {flights.map((flight, index) => (
                <FlightStatusCard key={index} flight={flight} />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-[200px] text-center text-xl mt-[50px]">
            <h1>No Flights Found</h1>
          </div>
        )
      ) : (
        <div className="w-full h-[200px] text-center text-xl mt-[50px]">
          <h1>No Airport Selected</h1>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-70 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <motion.h1
              className="text-base mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              Loading
              <motion.span
                className="ml-1 font-bold"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.11,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
              <motion.span
                className="ml-1 font-bold"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.33,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
              <motion.span
                className="ml-1 font-bold"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.66,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
              <motion.span
                className="ml-1 font-bold"
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 1,
                  delay: 0.99,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                .
              </motion.span>
            </motion.h1>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/50 text-red-400 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
};

export default FlightTrackerPage;
