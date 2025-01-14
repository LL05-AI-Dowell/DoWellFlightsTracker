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

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
