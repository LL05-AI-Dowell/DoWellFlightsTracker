import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CustomSelect from "./CustomSelect";
import { getCityList, getCountryList } from "../../services/api.config";
import { AppContext } from "../../ContextApi/ContextApi";

const LocationSelector = ({
  onLocationSelect = () => {},
  className = "",
  setShowLocationSelector,
}) => {


  const { setSearchedLatitude, setSearchedLongitude, selectedCity, setSelectedCity} =
    useContext(AppContext);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
 
  const [loading, setLoading] = useState({
    countries: false,
    cities: false,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading((prev) => ({ ...prev, countries: true }));
      try {
        const response = await getCountryList();
        setCountries(response);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
      }
      setLoading((prev) => ({ ...prev, countries: false }));
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchCities = async () => {
        setLoading((prev) => ({ ...prev, cities: true }));
        setCities([]);
        setSelectedCity(null);

        try {
          const response = await getCityList({
            country: selectedCountry.name,
            query: "all",
            limit: 10000,
            offset: 0,
          });
          const cityData = response.data.slice(1);

          setCities(cityData);
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("Failed to load cities");
        }
        setLoading((prev) => ({ ...prev, cities: false }));
      };

      fetchCities();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCity && selectedCountry) {
      onLocationSelect({
        city: selectedCity.name,
        country: selectedCountry.name,
        coordinates: {
          lat: selectedCity.lat,
          lon: selectedCity.lon,
        },
        countryCode: selectedCity.country_code,
        continent: selectedCity.continent,
      });

      setSearchedLatitude(selectedCity.lat);
      setSearchedLongitude(selectedCity.lon);

      const timer = setTimeout(() => {
        setShowLocationSelector(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedCity, selectedCountry, onLocationSelect]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <CustomSelect
        options={countries}
        value={selectedCountry}
        onChange={handleCountryChange}
        placeholder="Select a Country"
        loading={loading.countries}
        disabled={loading.countries}
      />

      <CustomSelect
        options={cities}
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="Select a City"
        loading={loading.cities}
        disabled={!selectedCountry || loading.cities}
      />
    </div>
  );
};

export default LocationSelector;
