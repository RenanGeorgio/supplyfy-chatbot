export function sendTypingOff(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  return messageData;
}

export function sendTypingOn(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  return messageData;
}