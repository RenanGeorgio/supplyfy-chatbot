async function processMessage(message) {
    const customerPhoneNumber = message.from;
    const messageType = message.type;
  
    if (messageType === "text") {
      const textMessage = message.text.body;
      console.log( textMessage );

        try {
            let replyButtonMessage = interactiveReplyButton;
            replyButtonMessage.to = process.env.RECIPIENT_PHONE_NUMBER;
            
            const replyButtonSent = await sendWhatsAppMessage(replyButtonMessage);
            console.log(replyButtonSent);
        } catch (error) {
            console.log(error);
        }
    } else if (messageType === "interactive") {
      const interactiveType = message.interactive.type;
  
      if (interactiveType === "button_reply") {
        const buttonId = message.interactive.button_reply.id;
        const buttonTitle = message.interactive.button_reply.title;
  
        if (buttonId == 1) {
          try {
            let productsList = interactiveList;
            productsList.to = process.env.RECIPIENT_PHONE_NUMBER;
            productsList.interactive.action.sections[0].rows = products.map(createProductsList);
  
            // Listas em mensagens tem um limite de 10 itens no total
            productsList.interactive.action.sections[0].rows.length = 10;
            const sendProductLists = await sendWhatsAppMessage(productsList);
            console.log(sendProductLists);
          } catch (error) {
            console.log(error);
          }
        }
      }
      else if (interactiveType === "list_reply") {
        const itemId = message.interactive.list_reply.id;
        const itemTitle = message.interactive.list_reply.title;
        const itemDescrption = message.interactive.list_reply.description;
      }
    }
}