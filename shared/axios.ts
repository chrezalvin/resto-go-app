import axios from "axios";
import { getItem } from "../libs/AsyncStorage";

export const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: process.env.AXIOS_TIMEOUT,
});

// add an intercepter before every request to check if the user is authenticated, then add the token to the header
axiosInstance
    .interceptors
    .request
    .use((config) => {
        console.log("getting token from local storage");

        const token = getItem("customer_id");

        if(token){
            console.log(`token found: ${token}`);
            config.headers.SESSION_ID = token;
        }
        else
            console.log("token not found");

        return config;
    });

export default axiosInstance;