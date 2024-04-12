import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../libs/trainModel";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import { clientExist, createClient } from "../../repositories/client";
import { chatOriginExist, createChat } from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";
import { createMessage } from "../../repositories/message";
import { webhookTrigger } from "../webhook/webhookTrigger";
<<<<<<< HEAD
import { Events, IBotData } from "../../types/types";
import { servicesActions } from "..";
import { findBot } from "../../helpers/findBot";
=======
import { Events } from "../../types/types";
import { produceMessage } from "../../core/kafka/producer";
>>>>>>> 806d40e7b31aa4ff62b05b46709cf6674bb3bcb0

const telegramService = async (token: string, webhook) => {
  const telegram = new TelegramBot(token, { polling: true });

  try {
    await telegram.getMe();
  } catch (error) {
    return telegram.stopPolling();
  }

<<<<<<< HEAD
  const bot = await botExist("services.telegram.token", token);

  const socketInfo = bot?.socket as IBotData["socket"];

  const { socket } = findBot(
    socketInfo._id.toString(),
    servicesActions.socket.sockets
  )!;
=======
  const botInfo = await botExist("services.telegram.token", token);

  const kafkaMessage = {
    topic: botInfo?.companyId + ".messages",
    service: "telegram"
  }
>>>>>>> 806d40e7b31aa4ff62b05b46709cf6674bb3bcb0

  let clientId: string | null = null;
  const botId = (await telegram.getMe()).id
  let enableChatBot = false;

  telegram.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const { first_name, last_name } = msg.chat;
    await produceMessage({ text: "/start", from: chatId.toString(), to: botId.toString(), ...kafkaMessage })

<<<<<<< HEAD
    await telegram.sendMessage(
      msg.chat.id,
      `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`
    );

    const { clientEmailEventEmitter } = await askEmail(telegram, msg);

    const createClientEvent = async (email: string) => {
      const checkClient = await clientExist(email);

      if (!checkClient) {
        const newClient = await createClient(
          email,
          first_name!,
          last_name || " "
        );
        clientId = newClient?._id.toString()!;
      } else {
        clientId = checkClient?._id.toString()!;
      }

      await telegram.sendMessage(chatId, `Olá, ${first_name}!`);
      enableChatBot = true;
    };

    clientEmailEventEmitter.once("telegramClientEmail", (email) =>
      createClientEvent(email)
    );
=======
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
>>>>>>> 806d40e7b31aa4ff62b05b46709cf6674bb3bcb0

    telegram.onText(/\/suporte/, async (msg) => {
      await produceMessage({ text: "/suporte", from: chatId.toString(), to: botId.toString(), ...kafkaMessage });
      const waitText = `Aguarde um momento, por favor!`;
      await produceMessage({ text: waitText, from: botId.toString(), to: chatId.toString(), ...kafkaMessage });
      await telegram.sendMessage(chatId, waitText);
      telegram.removeListener("message", messageHandler);
      telegram.removeTextListener(/\/suporte/);
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

          socket.emit("newClientChat", chatRepo);
          socket.emit("addNewUser", clientId);

          socket.on("disconnect", () => {
            socket.disconnect();
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
<<<<<<< HEAD
              socket.emit("sendMessage", newMessage);
            }
          });

          socket.on("getMessage", (msg) => {
=======
              await produceMessage({ text: newMessage.text ?? "", from: clientId ?? "", to: chatId.toString(), ...kafkaMessage })
              crmSocketClient.emit("sendMessage", newMessage);
            }
          });

          crmSocketClient.on("getMessage", async (msg) => {
            await produceMessage({ text: msg.text, from: chatId.toString(), to: clientId ?? "", ...kafkaMessage })
>>>>>>> 806d40e7b31aa4ff62b05b46709cf6674bb3bcb0
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
<<<<<<< HEAD
=======
      // console.log("enableChatBot: ", enableChatBot);
>>>>>>> 806d40e7b31aa4ff62b05b46709cf6674bb3bcb0
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
