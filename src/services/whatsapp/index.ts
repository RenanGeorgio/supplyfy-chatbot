import { whatsappCloudApi } from "../../api";

interface Props {
  senderBusinessPhoneId: string | number;
  recipientName: string;
  recipientPhoneNumber: string | number;
};

const WhatsappService = class<Props> {
  senderBusinessPhoneId: string | number;
  recipientName: string;
  recipientPhoneNumber: string | number;
  useWhatsappApi: unknown;
  constructor(senderBusinessPhoneId: string | number, recipientName: string, recipientPhoneNumber: string | number) {
    this.senderBusinessPhoneId = senderBusinessPhoneId;
    this.recipientName = recipientName;
    this.recipientPhoneNumber = recipientPhoneNumber;

    this.setWhatsappCloudApi('v20.0', senderBusinessPhoneId);
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

  getRecipientPhoneNumber(){
    return this.recipientPhoneNumber;
  }
};

export default WhatsappService;