import axios from "axios";
import https from "https";

const instagramApi = (version: string ='v20.0') => {
    const useInstagramApi = axios.create({
        baseURL: `https://graph.facebook.com/${version}`,
        withCredentials: true,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    return useInstagramApi;
}

export default instagramApi;