import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../libs/trainModel";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import {
  clientChatExist,
  createChatClient,
} from "../../repositories/chatClient";
import { createChat } from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";
import { createMessage } from "../../repositories/message";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";
import { ITelegramCredentials, IWebhook } from "../../types/types";
import Queue from "../../libs/Queue";
import { produceMessage } from "../../core/kafka/producer";
import { socketServiceController } from "../socket";
import { Events } from "../../types/enums";

const telegramService = async (
  credentials: ITelegramCredentials,
  webhook: IWebhook | undefined
) => {
  const token = credentials.token;
  const telegram = new TelegramBot(token, { polling: true }); // verficar depois
  let chatStarted = false; // testando
  let typebot = false; // testando
  let messageProcessing = false; // testando
  const typebotId = "lead-generation-yyf6x80"; // testando
  let typebotSession = null; // testando

  try {
    await telegram.getMe();
  } catch (error) {
    return telegram.stopPolling();
  }

  const bot = await botExist("services.telegram.token", token);

  if (!bot) {
    return;
  }

  // teste
  const socket = socketServiceController.start({
    _id: bot.companyId,
    url: "https://chatbot.ignai.com.br",
    auth: {
      token: "1234567890",
    },
  });

  if (!socket) {
    return;
  }

  // const socketInfo = bot?.socket as IBotData["socket"];

  // const socketService = findBot(
  //   socketInfo._id.toString(),
  //   servicesActions.socket.sockets
  // )!;

  // const socket = socketService?.socket;

  let clientId: string | null = null;
  let enableChatBot = false;

  const kafkaMessage = {
    topic: bot?.companyId,
    service: "telegram",
  };

  const botId = (await telegram.getMe()).id;

  const startChat = async (msg: TelegramBot.Message) => {
    telegram.removeTextListener(/\/start/);

    chatStarted = true;
    const chatId = msg.chat.id;
    const { first_name, last_name } = msg.chat;
    await produceMessage({
      text: "/start",
      from: chatId.toString(),
      to: botId.toString(),
      ...kafkaMessage,
    });
    const greetingsTextEmail = `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`;
    await produceMessage({
      text: greetingsTextEmail,
      from: botId.toString(),
      to: chatId.toString(),
      ...kafkaMessage,
    });
    await telegram.sendMessage(msg.chat.id, greetingsTextEmail);

    const { clientEmailEventEmitter } = await askEmail(telegram, msg);

    const createClientEvent = async (email: string) => {
      const checkClient = await clientChatExist(email);
      console.log("checkClient", checkClient)
      if (!checkClient) {
        const newClient = await createChatClient(
          email,
          first_name!,
          last_name || " "
        );
        clientId = newClient?._id.toString()!;
      } else {
        clientId = checkClient?._id.toString()!;
      }
      const greetingsText = `Olá, ${first_name}!`;
      await produceMessage({
        text: greetingsText,
        from: botId.toString(),
        to: chatId.toString(),
        ...kafkaMessage,
      });
      await telegram.sendMessage(chatId, greetingsText);
      messageProcessing = true;
    };

    clientEmailEventEmitter.once("telegramClientEmail", (email) =>
      createClientEvent(email)
    );

    telegram.on("message", messageHandler);

    const supportChat = async (msg: TelegramBot.Message) => {
      await produceMessage({
        text: "/suporte",
        from: chatId.toString(),
        to: botId.toString(),
        ...kafkaMessage,
      });
      const waitText = `Aguarde um momento, por favor!`;
      await telegram.sendMessage(chatId, waitText);
      await produceMessage({
        text: waitText,
        from: botId.toString(),
        to: chatId.toString(),
        ...kafkaMessage,
      });
      telegram.removeTextListener(/\/suporte/);
      telegram.removeListener("message", messageHandler);
      enableChatBot = false;

      if (bot) {
        const { companyId } = bot!;
        if (clientId && companyId && chatId) {
          // cria ou retorna um chat existente
          const chatRepo = await createChat({
            members: [clientId, bot?.companyId],
            origin: {
              platform: "telegram",
              chatId: chatId.toString(),
            },
          });

          socket.emit("newClientChat", chatRepo);
          socket.emit("addNewUser", clientId);
          // evento é sempre disparado quando o usuário iniciar o /suporte, mesmo que já exista um chat cadastrado
          if (webhook && chatRepo) {
            const { members, _id, timestamps } = chatRepo;

            webhookTrigger({
              url: webhook.url,
              event: Events.CHAT_CREATED, // mudar para CHAT_UPDATED, caso o chat já exista(se necessário)
              message: {
                members,
                chatId: _id,
                timestamps,
              },
              service: "telegram",
            });
          }

          const sendMessageToCrm = async (msg: TelegramBot.Message) => {
            const { text, date, from } = msg;
            const recipientId = companyId;

            const message = await createMessage(
              clientId!,
              chatRepo._id.toString(),
              text!
            );

            const newMessage: any = { ...message, recipientId };

            if (newMessage) {
              await produceMessage({
                text: newMessage.text ?? "",
                from: clientId ?? "",
                to: chatId.toString(),
                ...kafkaMessage,
              });
              console.log("antes do sendMessage ", newMessage);

              if (webhook) {
                webhookTrigger({
                  url: webhook.url,
                  event: Events.MESSAGE_RECEIVED,
                  message: newMessage,
                  service: "telegram",
                });
              }

              socket.emit("sendMessage", newMessage);
            }

            telegram.onText(/\/sair/, async () => {
              const endChatMessage =
                "Obrigado por nos contatar! Foi um prazer ajudar";

              Queue.add(
                "TelegramService",
                { id: chatId, message: endChatMessage },
                credentials._id
              );
              // socket.disconnect();
              telegram.removeTextListener(/\/sair/);
              telegram.onText(/\/suporte/, supportChat);
              telegram.removeListener("message", sendMessageToCrm);
              telegram.on("message", messageHandler);
            });
          };

          telegram.on("message", sendMessageToCrm);

          socket.on("getMessage", async (msg) => {
            console.log("get message", msg);
            await produceMessage({
              text: msg.text,
              from: chatId.toString(),
              to: clientId ?? "",
              ...kafkaMessage,
            });
            Queue.add(
              "TelegramService",
              { id: chatId, message: msg.text },
              credentials._id
            );
          });
        }
      }
    };

    telegram.onText(/\/suporte/, supportChat);
  };

  telegram.onText(/\/start/, startChat);

  const messageHandler = async (msg: TelegramBot.Message) => {
    console.log("continua no message handler");
    const { chat, text, date, from } = msg;
    if (text) {
      if (ignoredMessages(text)) return;
      if (from?.is_bot === false) {
        // await produceMessage({ text, from: chat.id.toString(), to: botId.toString(), ...kafkaMessage })
        if (messageProcessing) {
          const answer = await processQuestion(text ?? "");
          await produceMessage({
            text: answer,
            from: botId.toString(),
            to: chat.id.toString(),
            ...kafkaMessage,
          });
          Queue.add(
            "TelegramService",
            { id: chat.id, message: answer },
            credentials._id
          );
          // } else if (typebot) {
          //   // message processada via typebot
          //   const typebotChatMessage = await typebotChat(
          //     // typebotSession?.sessionId!,
          //     "lead-generation-yyf6x80", // testando
          //     text
          //   );

          //   const answer = typebotChatMessage?.messages; // adicionar tratamento para as mensagens do modelo, se é texto, img, etc
          //   const input = typebotChatMessage.input;

          //   for (const message of answer) {
          //     // await produceMessage({ text: message.text, from: botId.toString(), to: chat.id.toString(), ...kafkaMessage })
          //     Queue.add(
          //       "TelegramService",
          //       {
          //         id: chat.id,
          //         message:
          //           message.content.richText[0].children[0].text ||
          //           message.content.url,
          //       },
          //       credentials._id
          //     );
          //   }

          //   console.log("input", input);
          //   for (const item of input?.items) {
          //     if (input.type === "choice input") {
          //       console.log("condição de escolha");
          //       Queue.add(
          //         "TelegramService",
          //         {
          //           id: chat.id,
          //           message: "Escolha uma opção",
          //           options: {
          //             reply_markup: {
          //               inline_keyboard: [
          //                 [
          //                   {
          //                     text: item.content,
          //                     callback_data: item.content,
          //                   },
          //                 ],
          //               ],
          //             },
          //           },
          //         },
          //         credentials._id
          //       );
          //     }
          //   }

          //   // {
          //   //   "reply_markup": {
          //   //       "keyboard": [["Sample text", "Second sample"],   ["Keyboard"], ["I'm robot"]]
          //   //       }
          //   //   }
          // }
          // quando finalizar este fluxo, trocar para outro (quando o fluxo termina, a sessão é encerrada)
        }
      }
    }
  };

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
  console.info(`Telegram bot conectado: ${botName}`);

  return telegram;
};

export default telegramService;
