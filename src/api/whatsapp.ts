import axios from "axios";
import https from "https";

const whatsappCloudApi = (version: string = 'v20.0', phoneNumberId: string | number) => {
    const useWhatsappApi = axios.create({
        baseURL: `https://graph.facebook.com/${version}/${phoneNumberId}`,
        withCredentials: true,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    return useWhatsappApi;
}

export default whatsappCloudApi;