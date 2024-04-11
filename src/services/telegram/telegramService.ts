import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../libs/trainModel";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import { createClient } from "../../repositories/client";
import { chatOriginExist, createChat } from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";
import { crmSocketClient } from "../../core/http";
import { createMessage } from "../../repositories/message";
import { webhookTrigger } from "../webhook/webhookTrigger";
import { Events } from "../../types/types";
import { produceMessage } from "../../core/kafka/producer";

const telegramService = async (token: string, webhook) => {
  const telegram = new TelegramBot(token, { polling: true });

  try {
    await telegram.getMe();
  } catch (error) {
    return telegram.stopPolling();
  }

  const botInfo = await botExist("services.telegram.token", token);

  const kafkaMessage = {
    topic: botInfo?.companyId + ".messages",
    service: "telegram"
  }

  let clientId: string | null = null;
  const botId = (await telegram.getMe()).id
  let enableChatBot = false;

  telegram.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const { first_name, last_name } = msg.chat;
    await produceMessage({ text: "/start", from: chatId.toString(), to: botId.toString(), ...kafkaMessage })

    const checkIfClientOriginExist = await chatOriginExist({
      platform: "telegram",
      chatId: chatId.toString(),
    });

    if (checkIfClientOriginExist) {
      const greetingsText = `Olá, ${first_name}!`
      await telegram.sendMessage(chatId, greetingsText);
      await produceMessage({ text: greetingsText, from: botId.toString(), to: chatId.toString(), ...kafkaMessage })
      enableChatBot = true;
    } else {
      const greetingsText = `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`
      await telegram.sendMessage(
        chatId,
        greetingsText
      );
      await produceMessage({ text: greetingsText, from: botId.toString(), to: chatId.toString(), ...kafkaMessage })

      const { clientEmailEventEmitter } = await askEmail(telegram, msg);

      const createClientEvent = async (email: string) => {
        const client = await createClient(email, first_name!, last_name || " ");
        clientId = client?._id.toString()!;
        await telegram.sendMessage(chatId, `Olá, ${first_name}!`);
        await produceMessage({ text: `Olá, ${first_name}!`, from: botId.toString(), to: chatId.toString(), ...kafkaMessage })
      };

      clientEmailEventEmitter.once("telegramClientEmail", (email) =>
        createClientEvent(email)
      );

      enableChatBot = true;
    }

    telegram.onText(/\/suporte/, async (msg) => {
      await produceMessage({ text: "/suporte", from: chatId.toString(), to: botId.toString(), ...kafkaMessage });
      const waitText = `Aguarde um momento, por favor!`;
      await produceMessage({ text: waitText, from: botId.toString(), to: chatId.toString(), ...kafkaMessage });
      await telegram.sendMessage(chatId, waitText);
      telegram.removeListener("message", messageHandler);
      telegram.removeTextListener(/\/suporte/);

      const bot = await botExist("services.telegram.token", token);
      enableChatBot = false;

      if (bot) {
        const { companyId } = bot!;

        if (clientId && companyId && chatId) {
          const chatRepo = await createChat({
            members: [clientId, bot?.companyId],
            origin: {
              platform: "telegram",
              chatId: chatId.toString(),
            }
          });

          crmSocketClient.emit("newClientChat", chatRepo);
          crmSocketClient.emit("addNewUser", clientId);

          crmSocketClient.on("disconnect", () => {
            crmSocketClient.disconnect();
          });

          telegram.on("message", async (msg) => {
            const { text, date, from } = msg;
            const recipientId = companyId;

            const message = await createMessage(
              clientId!,
              chatRepo._id.toString(),
              text!
            );

            const newMessage = { ...message, recipientId };

            if (newMessage) {
              await produceMessage({ text: newMessage.text ?? "", from: clientId ?? "", to: chatId.toString(), ...kafkaMessage })
              crmSocketClient.emit("sendMessage", newMessage);
            }
          });

          crmSocketClient.on("getMessage", async (msg) => {
            await produceMessage({ text: msg.text, from: chatId.toString(), to: clientId ?? "", ...kafkaMessage })
            telegram.sendMessage(chatId, msg.text);
          });
        }
      }
    });
  });

  const messageHandler = async (msg: TelegramBot.Message) => {
    const { chat, text, date, from } = msg;
    if (text) {
      // console.log("Message received: ", text);
      if (!enableChatBot || ignoredMessages(text)) return;
      // console.log("enableChatBot: ", enableChatBot);
      if (from?.is_bot === false) {
        await produceMessage({ text, from: chat.id.toString(), to: botId.toString(), ...kafkaMessage })
        const answer = await processQuestion(text ?? "");
        telegram.sendMessage(chat.id, answer);
        await produceMessage({ text: answer, from: botId.toString(), to: chat.id.toString(), ...kafkaMessage })
      }
    }
  };

  telegram.on("message", messageHandler);

  telegram.on("polling_error", () => {
    if (webhook) {
      webhookTrigger({
        url: webhook.url,
        event: Events.SERVICE_ERROR,
        message: "telegram bot polling error",
        service: "telegram",
      });
    }
  });

  const botName = (await telegram.getMe()).username;
  console.info(`Telegram bot - ${botName} is running...`);

  return telegram;
};

export default telegramService;
