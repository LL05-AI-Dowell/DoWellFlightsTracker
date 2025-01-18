import { servicesAxiosInstance, countryAndCityAxiosInstance } from "./config";

const apiKey = "4f0bd662-8456-4b2e-afa6-293d4135facf";

export const getServerHealth = async () => {
  const response = await servicesAxiosInstance.get("/");
  return response.data;
};

export const fetchAirportApi = async (params) => {
    const response = await servicesAxiosInstance.post("/api/v1/flights/?type=get_airport_by_lat_long" , params )
    return response.data
}
export const fetchFlightsApi = async (params) => {
    const response = await servicesAxiosInstance.post('/api/v1/flights/?type=get_flights_arrival_departure' , params )
    return response.data
}

export const SignIn = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/api/v1/auth/?type=signin",
    {
      workspace_name: data.workspaceName,
      user_id: data.userId,
      password: data.password,
    }
  );
  return response.data;
};

export const selfidentification = async (token, workspaceId, documentId) => {
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await servicesAxiosInstance.get(
    `api/v1/auth/?type=self_identification&document_id=${documentId}&workspace_id=${workspaceId}`,
    { headers }
  );
  return response.data;
};


export const getCountryList = async () => {
  const response = await countryAndCityAxiosInstance.post(
    `/get-countries-v3/?api_key=${apiKey}`
  );
  const countries = response.data?.data[0]?.countries || [];
  return countries.map((country) => ({ name: country }));
};

export const getCityList = async (data) => {
  const response = await countryAndCityAxiosInstance.post(
    `/get-coords-v3/?api_key=${apiKey}`,
    data
  );
  return response.data;
};

export const checkProximity = async (data) => {
  const response = await servicesAxiosInstance.post(
    "/api/v1/flights/?type=check_proximity",
    data
  );
  return response.data;
}