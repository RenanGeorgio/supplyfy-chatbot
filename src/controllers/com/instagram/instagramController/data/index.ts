import sendAccountLinking from "./accountLinking";
import sendAudioMessage from "./audioMessage";
import sendButtonMessage from "./buttonMessage";
import sendFileMessage from "./fileMessage";
import sendGenericMessage from "./genericMessage";
import sendGifMessage from "./gifMessage";
import sendImageMessage from "./imageMessage";
import sendQuickReply from "./quickReply";
import sendReadReceipt from "./readReceipt";
import sendReceiptMessage from "./receiptMessage";
import sendTextMessage from "./textMessage";
import { sendTypingOff, sendTypingOn } from "./typing";
import sendVideoMessage from "./videoMessage";

export {
  sendAccountLinking as sendInstagramAccountLinking,
  sendAudioMessage as sendInstagramAudioMessage,
  sendButtonMessage as sendInstagramButtonMessage,
  sendFileMessage as sendInstagramFileMessage,
  sendGenericMessage as sendInstagramGenericMessage,
  sendGifMessage as sendInstagramGifMessage,
  sendImageMessage as sendInstagramImageMessage,
  sendQuickReply as sendInstagramQuickReply,
  sendReadReceipt as sendInstagramReadReceipt,
  sendReceiptMessage as sendInstagramReceiptMessage,
  sendTextMessage as sendInstagramTextMessage,
  sendTypingOff as sendInstagramTypingOff, 
  sendTypingOn as sendInstagramTypingOn,
  sendVideoMessage as sendInstagramVideoMessage
}