import { servicesAxiosInstance, tempAxiosInstance } from "./config";

export const getServerHealth = async () => {
  const response = await servicesAxiosInstance.get("/");
  return response.data;
};

export const fetchAirportApi = async (params) => {
  const response = await tempAxiosInstance.post(
    "/api/fligts/?type=get_airport_by_lat_long",
    params
  );
  return response.data;
};
export const fetchFlightsApi = async (params) => {
  const response = await tempAxiosInstance.post(
    "/api/fligts/?type=get_flights_arrival_departure",
    params
  );
  return response.data;
};

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
