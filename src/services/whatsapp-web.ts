import { Client, RemoteAuth } from "whatsapp-web.js";
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";
// import { processQuestion } from "../libs/bot/nlp/manager";
import qrcode from "qrcode-terminal";

const whatsappWebService = (id: string) => {
  let clientId = id;

  mongoose.connect(process.env.MONGO_URL ? process.env.MONGO_URL.replace(/[\\"]/g, '') : "").then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
      authStrategy: new RemoteAuth({
        clientId: clientId,
        store: store,
        backupSyncIntervalMs: 300000,
      }),
      // proxyAuthentication: { username: 'username', password: 'password' },
      puppeteer: {
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: false,
      },
    });

    client.initialize();

    client.on("loading_screen", (percent, message) => {
      console.log("LOADING SCREEN", percent, message);
    });

    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    client.on("remote_session_saved", () => {
      console.log("Saved");
    });

    client.on("authenticated", () => {
      console.log("AUTHENTICATED");
    });

    client.on("auth_failure", (msg) => {
      console.error("AUTHENTICATION FAILURE", msg);
    });

    client.on("ready", () => {
      console.log("Client is ready!");
    });

    client.on("message_ack", (msg, ack) => {
      /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

      if (ack == 3) {
        // The message was read
      }
    });

    client.on("change_state", (state) => {
      console.log("CHANGE STATE", state);
    });

    client.on("message", async (msg) => {
      console.log("MESSAGE RECEIVED", msg);

      if (msg.body === "!ping reply") {
        // Envia nova mensagem como resposta a mensagem atual
        // const response = await processQuestion(msg.body);
        // msg.reply(response);
      } else if (msg.body === "!ping") {
        // Envia nova mensagem no msm chat
        // const response = await processQuestion(msg.body);

        // client.sendMessage(msg.from, response);
      } else if (msg.body.startsWith("!sendto ")) {
        // Envia msg direta para um id especifico
        let number = msg.body.split(" ")[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);

        number = number.includes("@c.us") ? number : `${number}@c.us`;
        let chat = await msg.getChat();

        chat.sendSeen();

        client.sendMessage(number, message);
      } else if (msg.body.startsWith("!echo ")) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
      } else if (msg.body.startsWith("!preview ")) {
        const text = msg.body.slice(9);
        msg.reply(text, "", { linkPreview: true });
      } else if (msg.body === "!chats") {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
      } else if (msg.body === "!info") {
        let info = client.info;
        client.sendMessage(
          msg.from,
          `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `
        );
      } else if (msg.body === "!mediainfo" && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
      } else if (msg.body === "!quoteinfo" && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
      } else if (msg.body === "!resendmedia" && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
          const attachmentData = await quotedMsg.downloadMedia();
          client.sendMessage(msg.from, attachmentData, {
            caption: "Here's your requested media.",
          });
        }
        if (quotedMsg.hasMedia && quotedMsg.type === "audio") {
          const audio = await quotedMsg.downloadMedia();
          await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
        }
      } else if (msg.body === "!isviewonce" && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
          const media = await quotedMsg.downloadMedia();
          await client.sendMessage(msg.from, media, { isViewOnce: true });
        }
      } else if (msg.location) {
        msg.reply(msg.location);
      } else if (msg.body.startsWith("!status ")) {
        const newStatus = msg.body.split(" ")[1];
        await client.setStatus(newStatus);
        msg.reply(`Status was updated to *${newStatus}*`);
      } else if (msg.body === "!delete") {
        if (msg.hasQuotedMsg) {
          const quotedMsg = await msg.getQuotedMessage();
          if (quotedMsg.fromMe) {
            quotedMsg.delete(true);
          } else {
            msg.reply("I can only delete my own messages");
          }
        }
      } else if (msg.body === "!typing") {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
      } else if (msg.body === "!recording") {
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
      } else if (msg.body === "!clearstate") {
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
      } else if (msg.body === "!jumpto") {
        if (msg.hasQuotedMsg) {
          const quotedMsg = await msg.getQuotedMessage();
          // @ts-ignore
          client?.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
      } else if (msg.body === "!reaction") {
        msg.react("👍");
      } else if (msg.body === "!edit") {
        if (msg.hasQuotedMsg) {
          const quotedMsg = await msg.getQuotedMessage();
          if (quotedMsg.fromMe) {
            quotedMsg.edit(msg.body.replace("!edit", ""));
          } else {
            msg.reply("I can only edit my own messages");
          }
        }
      } else {
        if (msg.body) {
          // const response = await processQuestion(msg.body);
          // msg.reply(response);
        } else {
          /**
           * Pins a message in a chat, a method takes a number in seconds for the message to be pinned.
           * WhatsApp default values for duration to pass to the method are:
           * 1. 86400 for 24 hours
           * 2. 604800 for 7 days
           * 3. 2592000 for 30 days
           * You can pass your own value:
           */
          // @ts-ignore
          const result = await msg.pin(60); // Will pin a message for 1 minute
          console.log(result); // True if the operation completed successfully, false otherwise
        }
      }
    });

    client.on("disconnected", (reason) => {
      console.log("Client was logged out", reason);
    });
  });
}

export default whatsappWebService;
