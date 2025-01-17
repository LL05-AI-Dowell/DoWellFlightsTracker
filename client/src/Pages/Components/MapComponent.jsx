import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../ContextApi/ContextApi";
import LocationToggle from "./LocationToggle";

const MapComponent = ({getCurrentLocation}) => {
  const { latitude, longitude, airports } = useContext(AppContext);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
        document.head.appendChild(link);

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

      await new Promise((resolve) => setTimeout(resolve, 100));
      initializeMap();
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapInitialized(false);
      }

      const L = window.L;
      const defaultLat = latitude || 30;
      const defaultLng = longitude || 70;
      const zoom = latitude && longitude ? 8 : 4;

      mapRef.current.style.display = "none";
      mapRef.current.offsetHeight; 
      mapRef.current.style.display = "block";

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([defaultLat, defaultLng], zoom);

      mapInstanceRef.current = map;
      setIsMapInitialized(true);

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

        L.marker([latitude, longitude], { icon: redIcon })
          .bindPopup(`<b>My location</b><br>`)
          .addTo(map);
      }

      if (airports && airports.length > 0) {
        airports.forEach((airport) => {
          L.marker([airport.latitude, airport.longitude])
            .bindPopup(
              `<b>${airport.name}</b><br>${airport.city}, ${airport.countryCode}`
            )
            .addTo(map);
        });
      }

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapInitialized(false);
      }
    };
  }, [latitude, longitude, airports]);


  return (
    <div className="bg-gray-800 h-full relative rounded-lg border-2 border-blue-950">
      <LocationToggle getCurrentLocation={getCurrentLocation} />
      <div
        ref={mapRef}
        className="h-full  rounded-lg overflow-hidden"
        style={{ position: "relative", zIndex: 1 }}
      />
    </div>
  );
};

export default MapComponent;
