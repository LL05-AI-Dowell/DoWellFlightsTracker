import { servicesAxiosInstance } from './config'

export const getServerHealth = async () => {
    const response = await servicesAxiosInstance.get('/')
    return response.data
}