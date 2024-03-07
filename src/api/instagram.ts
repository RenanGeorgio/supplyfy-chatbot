import axios from "axios";
import https from "https";

interface Props {
    version?: string;
}

const instagramApi = ({ version='v19.0' }: Props) => {
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