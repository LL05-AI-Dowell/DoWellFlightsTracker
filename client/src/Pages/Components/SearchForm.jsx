import React, { useContext, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoAirplaneSharp } from "react-icons/io5";
import MapComponent from "./MapComponent";
import { AppContext } from "../../ContextApi/ContextApi";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { fetchFlightsApi } from "../../services/api.config";

const AirportSearch = () => {
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

  

  const fetchFlights = async (airportCode) => {
    setloading(true);
    try {
      const res = await fetchFlightsApi({
        airport_code: airportCode,
        year: dateTime.year,
        month: dateTime.month,
        day: dateTime.day,
        hourOfDay: dateTime.hour,
        maxFlights: flightsPerPage,
        typeOfStatus: typeOfStatus,
      });
      
      setFlights(res.response || []);
    } catch (err) {
      setError(`Error fetching flights: ${err.message}`);
    } finally {
      setloading(false);
    }
  };

  const handleAirportSelect = (airport) => {
    setSelectedAirport(airport);
    fetchFlights(airport.fs);
  };

  useEffect(() => {
    if (selectedAirport) {
      fetchFlights(selectedAirport.fs);
    }
  }, [typeOfStatus , flightsPerPage , dateTime.day , ]);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setDateTime({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: dateTime.hour,
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

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    if (name === "searchRadius") {
      setSearchRadius(parseInt(value));
    } else if (name === "flightsPerPage") {
      setFlightsPerPage(parseInt(value));
    }
  };

  const calculateSliderPercentage = (value) => {
    return ((value - 10) / (1000 - 10)) * 100;
  };

  const formatDateForInput = () => {
    return `${dateTime.year}-${String(dateTime.month).padStart(
      2,
      "0"
    )}-${String(dateTime.day).padStart(2, "0")}`;
  };

  const formatTimeForInput = () => {
    return `${String(dateTime.hour).padStart(2, "0")}:${String(
      dateTime.minute || 0
    ).padStart(2, "0")}`;
  };



  return (
    <>
      <div className="flex max-md:flex-col w-full overflow-hidden gap-4 mt-[30px] text-white text-base font-light">
        <div className="w-[40%] max-md:w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 space-y-6">
          <style>
            {`
            input[type="date"]::-webkit-calendar-picker-indicator,
            input[type="time"]::-webkit-calendar-picker-indicator {
              filter: invert(0);
              opacity: 1;
              cursor: pointer;
            }
            
            input[type="date"],
            input[type="time"] {
              color-scheme: dark;
            }

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
          `}
          </style>

          <div className="space-y-1">
            <label className="block">Date</label>
            <div className="relative">
              <input
                type="date"
                value={formatDateForInput()}
                onChange={handleDateChange}
                onClick={(e) => e.target.showPicker()}
                className="w-full border rounded-xl bg-transparent p-3 placeholder-gray-200 focus:outline-none text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block">Hours</label>
            <div className="relative">
              <input
                type="time"
                value={formatTimeForInput()}
                onChange={handleTimeChange}
                className="w-full border rounded-xl bg-transparent p-3 placeholder-gray-200 focus:outline-none text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex justify-between items-center">
              <h1>Search Radius (Miles):</h1>
              <h1>{searchRadius}</h1>
            </label>
            <div className="relative pt-1">
              <div className="h-1 bg-[#34d399]/20 rounded-full">
                <div
                  className="absolute h-1 bg-[var(--primary-color-green)] rounded-full"
                  style={{
                    width: `${calculateSliderPercentage(searchRadius)}%`,
                  }}
                >
                  <div className="slider-thumb"></div>
                </div>
              </div>
              <input
                type="range"
                name="searchRadius"
                min="10"
                max="1000"
                value={searchRadius}
                onChange={handleSliderChange}
                className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
              />
              <div className="flex justify-between text-xs mt-1 text-neutral-400">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex justify-between items-center">
              <h1>Flights Per Page:</h1>
              <h1>{flightsPerPage}</h1>
            </label>
            <div className="relative pt-1">
              <div className="h-1 bg-[#34d399]/20 rounded-full">
                <div
                  className="absolute h-1 bg-[var(--primary-color-green)] rounded-full"
                  style={{
                    width: `${calculateSliderPercentage(flightsPerPage)}%`,
                  }}
                >
                  <div className="slider-thumb"></div>
                </div>
              </div>
              <input
                type="range"
                name="flightsPerPage"
                min="10"
                max="1000"
                value={flightsPerPage}
                onChange={handleSliderChange}
                className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
              />
              <div className="flex justify-between text-xs mt-1 text-neutral-400">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 "> 
            <div
              onClick={() => setTypeOfStatus("arr")}
              className={`cursor-pointer w-full text-center border p-2 ${
                typeOfStatus == "arr" && "bg-[var(--primary-color-green)]"
              }  rounded-md mb-3`}
            >
              Arrivals
            </div>
            <div
              onClick={() => setTypeOfStatus("dep")}
              className={`cursor-pointer w-full text-center border p-2 ${
                typeOfStatus == "dep" && "bg-[var(--primary-color-green)]"
              }  rounded-md mb-3`}
            >
              Departures
            </div>
          </div>
        </div>

        <div className="flex-1 max-md:w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <IoAirplaneSharp className="text-[var(--primary-color-green)] rotate-[-45deg] text-xl" />
              <span className="text-2xl font-semibold">Nearby Airports</span>
            </div>

            <div className="w-full z-[1] relative rounded-lg overflow-hidden mb-6">
              <MapComponent />
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-[30px]  bg-gradient-to-br from-slate-900 to-slate-800  rounded-xl p-5 flex-wrap gap-2">
        {airports.length > 0 ? (
          airports.map((airport, index) => (
            <button
              key={index}
              onClick={() => handleAirportSelect(airport)}
              className={` px-4 py-2 text-xs  rounded-full transition-colors  ${
                selectedAirport?.fs === airport.fs
                  ? "bg-[#579B22]/10 text-[var(--primary-color-green)]"
                  : "bg-gray-700/30 border border-gray-700 hover:border-gray-600"
              }`}
            >
              {airport.name}
            </button>
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
    </>
  );
};

export default AirportSearch;
