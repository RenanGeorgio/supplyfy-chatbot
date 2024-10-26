import { sendFacebookTextMessage } from "../facebookController";
import { sendFacebookText } from "../processMessage";
import { FaceMessagingEvent } from "../../../../types";

export default function receivedMessage(event: FaceMessagingEvent) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  const isEcho = message.is_echo;
  const messageId = message.mid;
  const appId = message.app_id;
  const metadata = message.metadata;

  const messageText = message.text;
  const messageAttachments = message.attachments;
  const quickReply = message.quick_reply;

  if (isEcho) {
    console.log(
      'Received echo for message %s and app %d with metadata %s',
      messageId,
      appId,
      metadata
    );
    return;
  } else if (quickReply) {
    const quickReplyPayload = quickReply.payload;
    sendFacebookTextMessage(senderID, 'Quick reply tapped');
    return;
  }

  if (messageText) {
    /*
    TO-DO: Implementar os templates de msg 
    switch (
      messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
        case 'image':
          sendImageMessage(senderID, SERVER_URL + '/assets/rift.png');
          break;
        case 'gif':
          sendGifMessage(senderID);
          break;
        case 'audio':
          sendAudioMessage(senderID);
          break;
        case 'video':
          sendVideoMessage(senderID);
          break;
        case 'file':
          sendFileMessage(senderID);
          break;
        case 'button':
          sendButtonMessage(senderID);
          break;
        case 'generic':
          sendGenericMessage(senderID);
          break;
        case 'receipt':
          sendReceiptMessage(senderID);
          break;
        case 'quick reply':
          sendQuickReply(senderID);
          break;
        case 'read receipt':
          sendReadReceipt(senderID);
          break;
        case 'typing on':
          sendTypingOn(senderID);
          break;
        case 'typing off':
          sendTypingOff(senderID);
          break;
        case 'account linking':
          sendAccountLinking(senderID);
          break;
        default:
          sendFacebookText(senderID, messageText);
          break;
    }*/

    const info = {
      senderID,
      recipientID,
      timeOfMessage,
      messageId,
      appId,
      metadata
    }

    sendFacebookText(info, messageText);
  } else if (messageAttachments) {
    sendFacebookTextMessage(senderID, 'Message with attachment received');
  }
}