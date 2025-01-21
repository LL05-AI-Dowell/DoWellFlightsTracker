import React, { useContext, useEffect, useState } from "react";
import AirportSearch from "../Components/SearchForm";
import MapComponent from "../Components/MapComponent";
import SearchFormMobile from "./SearchFormMobile";
import mobilelogo from "../../assets/mobilelogo.png";
import thankyou from "../../assets/thankyou.png";
import { AppContext } from "../../ContextApi/ContextApi";
import { motion } from "framer-motion";
import FlightStatusCard from "../Components/FlightStatusCard";
import { IoAirplaneSharp } from "react-icons/io5";
import { FaSliders } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useLocation, useSearchParams } from "react-router-dom";
import { checkProximity } from "../../services/api.config";
import { Loader } from "lucide-react";
 

const FlightTrackerPageMobileView = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace_id");
  const userId = searchParams.get("user_id");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const [isMobile, setIsMobile] = useState(true);

  const {
    latitude,
    longitude,
    loading,
    error,
    setError,
    setLatitude,
    setLongitude,
    setSearchedLatitude,
    setSearchedLongitude,
    setloading,
    selectedAirport,
    flights,
    setTypeOfStatus,
    typeOfStatus,
    mobileWindow,
    exit,
    setexit,
    setcurrentLatitude,
    setcurrentLongitude,
    setSelectedCity,
    currentLatitude,
    currentLongitude,
  } = useContext(AppContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const checkIsMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };


  const checkUserAuthorization = async (lat, long) => {
    if (!checkIsMobile()) {
      setAuthChecking(false);
      setIsAuthorized(false);
      setAuthError("This application is only accessible on mobile devices");
      return;
    }

    try {
      const response = await checkProximity({
        user_id: userId,
        workspace_id: workspaceId,
        location_list: [lat.toString(), long.toString()],
      });

      if (response.success === false) {
        setAuthError(response.message);
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
        setAuthError("");
      }
      setAuthChecking(false);
    } catch (error) {
      setIsAuthorized(false);
      setAuthError(
        error.response?.data.response
          ? `${error.response.data.message} and you are ${(error.response.data.response).toFixed(2)} KM far.`
          : error.response?.data.message || "An error occurred."
      );
      setAuthChecking(false);
    }
  };

  const getCurrentLocation = () => {
    setloading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLat = position.coords.latitude;
          const currentLong = position.coords.longitude;

          setLatitude(currentLat);
          setLongitude(currentLong);
          setcurrentLatitude(currentLat);
          setcurrentLongitude(currentLong);

          setSearchedLatitude(null);
          setSearchedLongitude(null);
          setSelectedCity(null);

          if (workspaceId && userId) {
            checkUserAuthorization(currentLat, currentLong);
          }

          setloading(false);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          toast.error(`Error getting location: ${err.message}`);
          setloading(false);
          setAuthChecking(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported by this browser.");
      setloading(false);
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    setIsMobile(checkIsMobile());
    
    if (!workspaceId || !userId) {
      setAuthChecking(false);
      setIsAuthorized(false);
      setAuthError("You are not authorized to access this page");
      return;
    }

    if (!checkIsMobile()) {
      setAuthChecking(false);
      setIsAuthorized(false);
      setAuthError("This application is only accessible on mobile devices");
      return;
    }

    getCurrentLocation();
  }, [workspaceId, userId]);

  return (
    <div>
      <motion.div
        className="w-screen h-screen fixed z-[998] bg-white flex flex-col items-center justify-center"
        initial={{ x: 0 }}
        animate={{ x: isAuthorized ? "-100%" : 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: isAuthorized ? 2 : 0,
          duration: 0.5,
        }}
      >
        <img className="h-[12vh] w-fit" src={mobilelogo} alt="logo" />
        {authChecking && (
          <Loader className="w-6 h-6 mt-6 animate-spin text-blue-500" />
        )}
        {!isAuthorized && (
          <div className="text-center px-4">
            <p className="text-red-500 mt-4">{authError}</p>
            {/* {!isMobile && (
              <p className="text-sm text-gray-500 mt-2">
                Please open this application on your mobile device
              </p>
            )} */}
          </div>
        )}
      </motion.div>

      {isAuthorized && (
        <motion.div className="h-screen w-screen overflow-hidden">
          <div className="w-full h-[10vh]">
            <img className="h-full" src={mobilelogo} alt="logo" />
          </div>

          {mobileWindow === "map" ? (
            <div className="px-2 h-[60vh] mt-[2vh]">
              <MapComponent getCurrentLocation={getCurrentLocation} />
            </div>
          ) : mobileWindow === "flights" ? (
            <div className="mx-2 pt-1 mt-[1vh]">
              <div className="w-full p-3 h-[8vh] rounded-t-lg bg-blue-950 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IoAirplaneSharp className="text-[var(--primary-color-green)] rotate-[-45deg] text-xl" />
                  <div className="flex flex-wrap items-center">
                    <h1 className="text-sm mr-2 font-semibold">
                      Flight Schedule
                    </h1>
                    <h1 className="text-xs text-gray-400">
                      Showing {flights.length} flights
                    </h1>
                  </div>
                </div>
                <div className="relative text-sm w-[120px]">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-4"
                  >
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
                      transition={{ duration: 0.2, easing: "easeInOut" }}
                      className={`absolute z-[40] flex flex-col top-full right-0 bg-gradient-to-br from-slate-900 to-slate-800 py-4 px-8 rounded-md shadow-xl ${
                        isDropdownOpen ? "block" : "hidden"
                      }`}
                    >
                      <div
                        onClick={() => setTypeOfStatus("arr")}
                        className={`cursor-pointer w-full text-center p-2 ${
                          typeOfStatus == "arr" &&
                          "bg-[var(--primary-color-green)]"
                        } rounded-md mb-3`}
                      >
                        Arrivals
                      </div>
                      <div
                        onClick={() => setTypeOfStatus("dep")}
                        className={`cursor-pointer w-full text-center p-2 ${
                          typeOfStatus == "dep" &&
                          "bg-[var(--primary-color-green)]"
                        } rounded-md mb-3`}
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
                    <div className="w-full rounded-b-lg h-[53vh] overflow-y-auto scrollbar-hide px-2 mb-[2vh] bg-blue-950">
                      {flights.map((flight, index) => (
                        <FlightStatusCard key={index} flight={flight} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-[53vh] text-center text-xl pt-[50px]">
                    <h1>No Flights Found</h1>
                  </div>
                )
              ) : (
                <div className="w-full h-[53vh] text-center text-xl pt-[50px]">
                  <h1>No Airport Selected</h1>
                </div>
              )}
            </div>
          ) : null}

          <div className="h-[24vh] mt-[2vh] mb-[1vh] px-1 w-full">
            <SearchFormMobile getCurrentLocation={getCurrentLocation} />
          </div>
        </motion.div>
      )}

      {exit && (
        <motion.div
          className="fixed z-[999] flex flex-col justify-center items-center gap-10 top-0 w-screen h-screen bg-white"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.5,
          }}
        >
          <img className="h-[12vh] w-fit" src={thankyou} alt="" />
          <img className="h-[12vh] w-fit" src={mobilelogo} alt="logo" />
          <div className="h-[200px]"></div>
          <h1 className="font-semibold">DoWell UX Living Lab</h1>
        </motion.div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm text-white flex items-center justify-center z-[99]">
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
    </div>
  );
};

export default FlightTrackerPageMobileView;
