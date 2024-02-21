export const sendMsg = async (data) => {
    try {
        const response = await whatsappCloudApi("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: data
        });

        if (response) {
            return response;
        }
    
        return null;
    } catch (error) {
        next(error);
    } 
}

export const msgStatusChange = async (messageId: string | number) => {
    const data = {
        messaging_product: this.messagingProduct,
        status: 'read',
        //to: this.recipientPhoneNumber,
        message_id: messageId
    }

    const response = await sendMsg(data);

    return response;
}