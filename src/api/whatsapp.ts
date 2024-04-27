import axios from "axios";
import https from "https";

const whatsappCloudApi = (version: string = 'v19.0', senderPhoneId: string | number) => {
    const useWhatsappApi = axios.create({
        baseURL: `https://graph.facebook.com/${version}/${senderPhoneId}`,
        withCredentials: true,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    return useWhatsappApi;
}

export default whatsappCloudApi;