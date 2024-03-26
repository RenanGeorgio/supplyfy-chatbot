import TelegramBot from "node-telegram-bot-api";
import { validateEmail } from "../../../helpers/validateEmail";
import EventEmitter from "node:events";

const clientEmailEventEmitter = new EventEmitter();

export const askEmail = async (
  telegram: TelegramBot,
  msg: TelegramBot.Message
) => {
  (async () => {
    const prompt = await telegram.sendMessage(
      msg.chat.id,
      "Informe seu e-mail:",
      {
        reply_markup: {
          force_reply: true,
        },
      }
    );

    telegram.onReplyToMessage(
      msg.chat.id,
      prompt.message_id,
      async (replyMsg) => {
        const email = replyMsg.text;
        const isValid = validateEmail(email!);

        if (!isValid) {
          await telegram.sendMessage(msg.chat.id, `E-mail invalido!`);
          await askEmail(telegram, msg);
          return;
        }
        clientEmailEventEmitter.emit("telegramClientEmail", email);
      }
    );
  })();
  return { clientEmailEventEmitter };
};
