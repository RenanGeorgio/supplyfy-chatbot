export default {
  key: "TelegramService",
  async handle({ data }) {

    const { id, message, callback } = data;
    await JSON.parse(callback).call(this, id, message);
    return true
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};
