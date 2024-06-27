import { whatsappCloudApi } from "../../api";

interface Props {
  senderPhoneNumberId: string | number;
  recipientName: string;
  recipientPhoneNumberId: string | number;
  accessToken: string;
};

const WhatsappService = class<Props> {
  senderPhoneNumberId: string | number;
  recipientName: string;
  recipientPhoneNumberId: string | number;
  accessToken: string;
  useWhatsappApi: unknown;
  constructor({ senderPhoneNumberId, recipientName, recipientPhoneNumberId, accessToken }) {
    this.senderPhoneNumberId = senderPhoneNumberId;
    this.recipientName = recipientName;
    this.recipientPhoneNumberId = recipientPhoneNumberId;
    this.accessToken = accessToken;
    this.setWhatsappCloudApi('v20.0', senderPhoneNumberId);
  }

  setWhatsappCloudApi(version: string = 'v20.0', senderPhoneId: string | number){
    this.useWhatsappApi = whatsappCloudApi(version, senderPhoneId);
    return;
  }

  getApi(){
    return this.useWhatsappApi;
  }

  getRecipientName(){
    return this.recipientName;
  }

  getRecipientPhoneNumberId(){
    return this.recipientPhoneNumberId;
  }

  getSenderPhoneNumberId() {
    return this.senderPhoneNumberId;
  }

  getAccessToken() {
    return this.accessToken;
  }
};

export default WhatsappService;