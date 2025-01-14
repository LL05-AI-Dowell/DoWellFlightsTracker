import { servicesAxiosInstance, tempAxiosInstance } from './config'

export const getServerHealth = async () => {
    const response = await servicesAxiosInstance.get('/')
    return response.data
}

export const fetchAirportApi = async (params) => {
    const response = await tempAxiosInstance.post('/api/fligts/?type=get_airport_by_lat_long' , params )
    return response.data
}
export const fetchFlightsApi = async (params) => {
    const response = await tempAxiosInstance.post('/api/fligts/?type=get_flights_arrival_departure' , params )
    return response.data
}