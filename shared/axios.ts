import axios from "axios";
import { getItem } from "../libs/AsyncStorage";

const config = require("../appConfig.json");

export const axiosInstance = axios.create({
    baseURL: config.BASE_URL,
    timeout: config.AXIOS_TIMEOUT,
    validateStatus: () => true,
});

// add an intercepter before every request to check if the user is authenticated, then add the token to the header
axiosInstance
    .interceptors
    .request
    .use(async (config) => {
        console.log(`accessing ${config.url}`);
        console.log("getting token from local storage");

        if(config.url === "/authenticate")
            return config;

        const token = await getItem("customer_id");

        if(token){
            console.log(`token found: ${token}`);
            config.headers.CUSTOMER_ID = token;
        }
        else
            console.log("token not found");

        return config;
    });

export const axiosCashierInstance = axios.create({
    baseURL: config.BASE_URL,
    timeout: config.AXIOS_TIMEOUT,
    validateStatus: () => true,
});

export default axiosInstance;