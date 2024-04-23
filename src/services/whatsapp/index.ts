interface Props {
  senderBusinessPhoneId: string | number;
  recipientName: string;
  recipientPhoneNumber: string | number;
};

const WhatsappService = class<Props> {
  senderBusinessPhoneId: string | number;
  recipientName: string;
  recipientPhoneNumber: string | number;
  constructor(senderBusinessPhoneId: string | number, recipientName: string, recipientPhoneNumber: string | number) {
    this.senderBusinessPhoneId = senderBusinessPhoneId;
    this.recipientName = recipientName;
    this.recipientPhoneNumber = recipientPhoneNumber;
  }

  getRecipientName(){
    return this.recipientName;
  }

  getRecipientPhoneNumber(){
    return this.recipientPhoneNumber;
  }
};

export default WhatsappService;