import axios from "axios";
import https from "https";

interface Props {
    version?: string;
    senderPhoneId: string | number;
}

const whatsappCloudApi = async ({ version='v19.0', senderPhoneId }: Props) => {
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