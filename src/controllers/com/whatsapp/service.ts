export const msgStatusChange = async (messageId: string | number) => {
    const response = await whatsappCloudApi("/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.bearerToken}`
        },
        data: {
            messaging_product: this.messagingProduct,
            status: 'read',
            //to: this.recipientPhoneNumber,
            message_id: messageId
        }
    });

    if (response) {
        return response;
    }

    return null;
}