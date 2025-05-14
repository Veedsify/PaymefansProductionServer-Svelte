import axios from "axios";
import { env } from '$env/dynamic/public';
const axiosInstance = axios.create({
    baseURL: env.PUBLIC_TS_EXPRESS_URL,  // Set your base URL here
});

export default axiosInstance;
