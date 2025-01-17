import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  const [flightsPerPage, setFlightsPerPage] = useState(10);
  const [searchRadius, setSearchRadius] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateTime, setDateTime] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  });
  const [typeOfStatus, setTypeOfStatus] = useState("arr");
  const [currentLatitude, setcurrentLatitude] = useState(null);
  const [currentLongitude, setcurrentLongitude] = useState(null);
  const [searchedLatitude, setSearchedLatitude] = useState(null);
  const [searchedLongitude, setSearchedLongitude] = useState(null);
  const [mobileWindow, setmobileWindow] = useState("map");
  const [exit, setexit] = useState(false);

  return (
    <AppContext.Provider
      value={{
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        currentLatitude,
        setcurrentLatitude,
        currentLongitude,
        setcurrentLongitude,
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
        searchedLatitude,
        setSearchedLatitude,
        searchedLongitude,
        setSearchedLongitude,
        mobileWindow,
        setmobileWindow,
        exit,
        setexit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
