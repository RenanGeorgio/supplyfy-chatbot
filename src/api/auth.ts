import axios from "axios";
import https from "https";

const url = process.env.USER_CONTROL ? process.env.USER_CONTROL.replace(/[\\"]/g, '') : ""

const authApi = axios.create({
    baseURL: url,
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

export default authApi;