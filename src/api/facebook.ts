import axios from "axios";
import https from "https";

const facebookApi = (version: string = 'v20.0') => {
    const useFacebookApi = axios.create({
        baseURL: `https://graph.facebook.com/${version}`,
        withCredentials: true,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    return useFacebookApi;
}

export default facebookApi;