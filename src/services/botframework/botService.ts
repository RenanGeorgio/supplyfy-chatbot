export default async function botService(data: any) {
    try {
        const { message } = data;
        // redirecionar conversation id para o usuário
        return message
    } catch (error: any) {
        throw new Error("Error sending message");
    }
}