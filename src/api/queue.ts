import axios from "axios";
import https from "https";

const url = process.env.QUEUE_SERVER ? process.env.QUEUE_SERVER.replace(/[\\"]/g, '') : ""

const queueApi = axios.create({
    baseURL: url,
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

export default queueApi;