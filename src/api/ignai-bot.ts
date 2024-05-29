import axios from "axios";
import https from "https";

const url = process.env.IGNAI_BOT ? process.env.IGNAI_BOT.replace(/[\\"]/g, '') : ""

const ignaiApi = axios.create({
    baseURL: url,
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

export default ignaiApi;