import React, { useContext, useEffect, useState } from "react";
import { ArrowDown, RotateCcw, Scale, Search } from "lucide-react";
import { AppContext } from "../../ContextApi/ContextApi";
import { fetchAirportApi, fetchFlightsApi } from "../../services/api.config";
import { IoChevronBack, IoClose } from "react-icons/io5";
import { MdSendToMobile } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const SearchFormMobile = ({ getCurrentLocation }) => {
  const {
    airports,
    setAirports,
    selectedAirport,
    setSelectedAirport,
    latitude,
    longitude,
    loading,
    setloading,
    searchRadius,
    setSearchRadius,
    dateTime,
    setDateTime,
    typeOfStatus,
    setTypeOfStatus,
    flights,
    setFlights,
    setError,
    error,
    mobileWindow,
    setmobileWindow,
    exit,
    setexit,
  } = useContext(AppContext);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setDateTime({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: dateTime.hour,
      minute: dateTime.minute,
    });
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    setDateTime((prev) => ({
      ...prev,
      hour: hours,
      minute: minutes,
    }));
  };

  const calculateSliderPercentage = (value) => {
    return ((value - 10) / (1000 - 10)) * 100;
  };

  const fetchAirports = async (lat, long) => {
    try {
      setloading(true);

      const res = await fetchAirportApi({
        latitude: lat,
        longitude: long,
        radiusMiles: searchRadius,
      });

      if (res) {
        setAirports(res.response || []);
      }
    } catch (err) {
      console.log(`Error fetching airports: ${err.message}`);
      setError(`Error in Fetching Aairports: ${err.message}`);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude && searchRadius) {
      fetchAirports(latitude, longitude);
    }
  }, [latitude, longitude, searchRadius]);

  const fetchFlights = async (airportCode) => {
    setloading(true);
    try {
      const res = await fetchFlightsApi({
        airport_code: airportCode,
        year: dateTime.year,
        month: dateTime.month,
        day: dateTime.day,
        hourOfDay: dateTime.hour,
        maxFlights: "50",
        typeOfStatus: typeOfStatus,
      });

      setFlights(res.response || []);
    } catch (err) {
      console.log(`Error fetching flights: ${err.message}`);
      toast.error(`error fetching flights: ${err.message}`);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (selectedAirport) {
      fetchFlights(selectedAirport.fs);
    }
  }, [typeOfStatus, dateTime]);

  const [isAirportsOpen, setIsAirportsOpen] = useState(false);
  const handleNearbyAirports = () => {
    setIsAirportsOpen(true);
  };

  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport);
    fetchFlights(airport.fs);
    setmobileWindow("flights");
    setIsAirportsOpen(false);
  };

  const handleClose = () => {
    setIsAirportsOpen(false);
  };

  const handleSearchFlight = () => {
    if (selectedAirport) {
      fetchFlights(selectedAirport?.fs);
      setmobileWindow("flights");
    } else {
      toast.error("please Select Airport");
      handleNearbyAirports();
    }
  };

  const handleRefresh = () => {
    getCurrentLocation();
    setTypeOfStatus("arr");
    setSearchRadius("100");
    setSelectedAirport("");
    setAirports([]);
    const now = new Date();
    setDateTime({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    });
  };

  return (
    <>
      <div className="bg-[#002147]  flex flex-col justify-between  h-[25vh]  text-white py-[1vh] pb-[2vh]  px-2 text-sm rounded-lg">
        <style>
          {`
          .slider-thumb {
            position: absolute;
            height: 10px;
            width: 10px;
            background: white;
            border-radius: 50%;
            top: 50%;
            right: 0;
            transform: translate(50%, -50%);
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="time"]::-webkit-calendar-picker-indicator {
            opacity: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            cursor: pointer;
          }
          
          input[type="date"],
          input[type="time"] {
            color-scheme: dark;
            cursor: pointer;
    
          }

          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;  
              scrollbar-width: none; 
          }
        `}
        </style>
        <div className="flex  text-xs gap-2 items-center justify-between">
          <div className="flex  items-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={typeOfStatus === "dep"}
                onChange={() => setTypeOfStatus("dep")}
                className="w-5 h-5"
              />
              <span className="">Departure</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={typeOfStatus === "arr"}
                onChange={() => setTypeOfStatus("arr")}
                className="w-5 h-5"
              />
              <span className="">Arrival</span>
            </label>
          </div>

          <div className="flex items-center gap-2 ">
            <input
              type="date"
              value={`${dateTime.year}-${String(dateTime.month).padStart(
                2,
                "0"
              )}-${String(dateTime.day).padStart(2, "0")}`}
              onChange={handleDateChange}
              className="bg-transparent relative w-[82px] border-2 border-white/20 text-white placeholder-gray-200 focus:outline-none rounded-full px-1 sm:px-3 sm:w-[100px] py-1 "
            />

            <input
              type="time"
              value={`${String(dateTime.hour).padStart(2, "0")}:${String(
                dateTime.minute
              ).padStart(2, "0")}`}
              onChange={handleTimeChange}
              className="bg-transparent w-[45px] relative border-2 border-white/20 text-white placeholder-gray-200 focus:outline-none rounded-full px-1 sm:px-3 sm:w-[60px] py-1 "
            />
          </div>
        </div>
        <div className="mt-[2vh]">
          <div className="flex justify-between mb-2">
            <span className="">Distance to airport</span>
            <span className="">
              {searchRadius} Miles / {Math.round(searchRadius * 1.60934)} KM
            </span>
          </div>
          {mobileWindow === "flights" ? (
            <div className="text-red-500 text-[10px]">
              DisClaimer-The Information May Not Accurate , Check
            </div>
          ) : mobileWindow === "map" ? (
            <div className="relative pt-1">
              <div className="h-1 bg-[#34d399]/20 rounded-full">
                <div
                  className="absolute h-1 bg-[#34d399] rounded-full"
                  style={{
                    width: `${calculateSliderPercentage(searchRadius)}%`,
                  }}
                >
                  <div className="slider-thumb"></div>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
              />
              <div className="flex justify-between text-xs mt-1 text-neutral-400">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>
          ) : null}
        </div>

        {mobileWindow === "map" ? (
          <div className=" flex justify-between ">
            <motion.button
              onClick={handleRefresh}
              whileTap={{ scale: 0.9, rotate: 360 }}
              className="w-[40px] h-[40px] flex justify-center items-center bg-white/10 hover:bg-white/20 transition-colors rounded-full"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>{" "}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleNearbyAirports}
              className="flex items-center gap-2 border border-white hover:bg-white/20 transition-colors rounded-lg px-[5vw] py-2 text-base"
            >
              <span> Nearby Airports </span>
              <ArrowDown className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSearchFlight}
              className="w-[40px] h-[40px] flex justify-center items-center bg-green-500 hover:bg-green-600 transition-colors rounded-full"
            >
              <Search className="w-6 h-6" />
            </motion.button>
          </div>
        ) : mobileWindow === "flights" ? (
          <div className=" flex justify-between ">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setmobileWindow("map");
                setSelectedAirport("");
              }}
              className="w-[40px] h-[40px] flex justify-center items-center bg-white/10 hover:bg-white/20 transition-colors rounded-full"
            >
              <IoChevronBack className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleNearbyAirports}
              className="flex  items-center gap-2 border border-white hover:bg-white/20 transition-colors rounded-lg px-[2vw] py-2 text-base"
            >
              <span className="w-[150px] md:w-fit whitespace-nowrap  overflow-hidden">
                {selectedAirport?.fs}-{selectedAirport?.name}
              </span>
              <ArrowDown className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setexit(true)}
              className="w-[40px] h-[40px] flex justify-center items-center bg-white/10 hover:bg-white/20 transition-colors rounded-full"
            >
              <MdSendToMobile className="w-6 h-6" />
            </motion.button>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {isAirportsOpen && (
          <motion.div
            id="mobileairports"
            className=" max-h-[65vh] rounded-t-lg  w-full p-3 text-white bg-blue-950 fixed bottom-0 left-0 z-20"
            initial={{ y: "100%" }}
            animate={{ y: "0px" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="w-full flex justify-center">
              <button onClick={handleClose}>
                <IoClose className="text-2xl" />
              </button>
            </div>
            <div className="flex mt-2 min-h-[150px]  max-h-[55vh] overflow-y-auto scrollbar-hide  bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5  px-1 flex-wrap gap-2">
              {error ? (
                <div className="text-red-500 text-xs">DisClaimer-{error}</div>
              ) : airports.length > 0 ? (
                airports.map((airport, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    key={index}
                    onClick={() => handleAirportSelect(airport)}
                    className={`px-4 h-fit text-left py-2 text-xs rounded-full transition-colors ${
                      selectedAirport?.fs === airport.fs
                        ? "bg-[#579B22]/10 text-[var(--primary-color-green)]"
                        : "bg-gray-700/30 border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {airport.fs}-{airport.name}
                  </motion.button>
                ))
              ) : (
                <motion.h1
                  className="text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  Fetching Airports<span className="ml-1">.</span>
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchFormMobile;
