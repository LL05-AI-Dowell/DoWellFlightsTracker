import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { AppContext } from "../../ContextApi/ContextApi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  const { latitude, longitude, airports } = useContext(AppContext);

  const defaultPosition = [latitude || 30, longitude || 70];
  const zoom = latitude && longitude ? 8 : 4;

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="bg-gray-800 relative rounded-lg border-2 border-blue-950">
      <div className="absolute flex justify-center gap-5 w-[100%] pt-2 h-[100px] z-[99]">
        <div className="font-semibold border-[1.2px] border-blue-950 w-[150px] h-fit p-2 rounded-lg bg-white text-xs flex">
          <div className="w-[15%]">
            <div className="w-4 h-4 rounded-full border-2 border-blue-950 cursor-pointer bg-blue-950"></div>
          </div>
          <div className="w-[85%]">
            <h1>Current Location</h1>
            <h1>
              Lat:{" "}
              <span className="font-normal">
                {latitude?.toFixed(2) || "75.00"}
              </span>
            </h1>
            <h1>
              Long:{" "}
              <span className="font-normal">
                {longitude?.toFixed(2) || "75.00"}
              </span>
            </h1>
          </div>
        </div>

        <div className="font-semibold border-[1.2px] border-blue-950 w-[150px] h-fit p-2 rounded-lg bg-white text-xs flex">
          <div className="w-[15%]">
            <div className="w-4 h-4 rounded-full border-2 border-blue-950 cursor-pointer"></div>
          </div>
          <div className="w-[85%]">
            <h1>Selected Location</h1>
            <h1>
              Lat: <span className="font-normal">75.00</span>
            </h1>
            <h1>
              Long: <span className="font-normal">75.00</span>
            </h1>
          </div>
        </div>
      </div>

      <MapContainer
        center={defaultPosition}
        zoom={zoom}
        className="h-96 max-md:h-[54vh] rounded-lg overflow-hidden"
        style={{ position: "relative", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={redIcon}>
            <Popup>
              <b>My location</b>
            </Popup>
          </Marker>
        )}

        {airports.map((airport, index) => (
          <Marker key={index} position={[airport.latitude, airport.longitude]}>
            <Popup>
              <b>{airport.name}</b>
              <br />
              {airport.city}, {airport.countryCode}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
