export default function sendQuickReply(recipientId: string | number, label: string = "teste") {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: label,
      quick_replies: [
        {
          content_type: 'text',
          title: 'Action',
          payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION'
        },
        {
          content_type: 'text',
          title: 'Comedy',
          payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY'
        },
        {
          content_type: 'text',
          title: 'Drama',
          payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA'
        }
      ]
    }
  };

  return messageData;
}