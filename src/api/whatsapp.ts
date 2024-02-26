import axios from "axios";
import https from "https";

const whatsappCloudApi = axios.create({
    baseURL: "https://graph.facebook.com/"
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

export default whatsappCloudApi;