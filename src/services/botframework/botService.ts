export default async function botService(data: any) {
    try {
        const { message } = data;
        console.log(message)
        return message
    } catch (error: any) {
        throw new Error("Error sending message");
    }
}