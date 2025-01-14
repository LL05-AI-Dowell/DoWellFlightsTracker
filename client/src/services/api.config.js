import { servicesAxiosInstance, tempAxiosInstance } from './config'

export const getServerHealth = async () => {
    const response = await servicesAxiosInstance.get('/')
    return response.data
}
export const fetchAirports = async (data) => {
    const response = await tempAxiosInstance.post('/api/fligts/?type=get_airport_by_lat_long',data)
    return response.data
}