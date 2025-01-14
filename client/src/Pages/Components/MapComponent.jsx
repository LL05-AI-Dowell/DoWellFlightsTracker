import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../ContextApi/ContextApi";

const MapComponent = () => {
  const { latitude , longitude , airports} = useContext(AppContext)

  const mapRef = useRef(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
      document.head.appendChild(link);

      if (!window.L) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js";
        script.async = true;

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      initializeMap();
    };

    const initializeMap = () => {
      const L = window.L;

      const defaultLat = latitude || 30;
      const defaultLng = longitude || 70;
      const zoom = latitude && longitude ? 8 : 4;

      const map = L.map("map").setView([defaultLat, defaultLng], zoom);

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      if (latitude && longitude) {
         
          const redIcon = L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

        L.marker([latitude, longitude], {icon: redIcon}).bindPopup(`
          <b>My location</b><br>
         
        `)
        .addTo(map).addTo(map);
      }

      if(airports.length > 0) {
        airports.forEach((airport) => {
          L.marker([airport.latitude, airport.longitude])
           .bindPopup(
              `
              <b>${airport.name}</b><br>
              ${airport.city},
              ${airport.countryCode}
              `
            )
           .addTo(map);
        });

      }else{}
    };

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude , airports]);

  return (
    <div className="bg-gray-800  rounded-lg">
      <div id="map" className="h-96 rounded-lg" />
    
    </div>
  );
};

export default MapComponent;
