import axios from "axios";
import https from "https";

const facebookApi = axios.create({
    baseURL: "https://graph.facebook.com",
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

export default facebookApi;