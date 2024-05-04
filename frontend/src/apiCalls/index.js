import axios from 'axios';
const axiosInstance = axios.create(
    {
        headers: {
            baseURL: `${window.location.origin}/api/`,
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
);
export default axiosInstance;