import axios from "axios";
import https from "https";

const authApi = axios.create({
    baseURL: process.env.USER_CONTROL,
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

export default authApi;