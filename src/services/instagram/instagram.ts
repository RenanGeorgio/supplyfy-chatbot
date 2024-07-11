// Comentado por Thomás para rodar primeira versão sem instagram-private-api
import { GraphQLSubscriptions, IgApiClientRealtime } from "instagram_mqtt";
import { processQuestion } from "../../libs/bot/nlp/manager";
import { Events } from "../../types/enums";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";

const intagramService = async (ig: IgApiClientRealtime, webhook: any) => {
  if (ig) {
    // const userId = ig.state.cookieUserId;

    const connectParams = 
      {
        // graphQlSubs: [
        //   GraphQLSubscriptions.getAppPresenceSubscription(),
        //   GraphQLSubscriptions.getZeroProvisionSubscription(ig.state.phoneId),
        //   GraphQLSubscriptions.getDirectStatusSubscription(),
        //   GraphQLSubscriptions.getDirectTypingSubscription(ig.state.cookieUserId),
        //   GraphQLSubscriptions.getAsyncAdSubscription(ig.state.cookieUserId),
        // ],
        // irisData: await ig.feed.directInbox().request(),
        autoReconnect: true,
    }

    const igConnect = await ig.realtime.connect(connectParams);

    ig.realtime.on("message", async (msg) => {
      if (msg.realtime) {
        const { message } = msg;
        const { thread_id, user_id, text } = message;

        // if (user_id && user_id.toString() !== userId) {
        //   try {
        //     const responseMessage: string = await processQuestion(text as string);
        //     await ig.entity.directThread(thread_id!).markItemSeen(message.item_id!);
        //     await ig.entity.directThread(thread_id!).broadcastText(responseMessage)
      
        //   } catch (error) {
        //     console.error("Error while trying to send the message", error);
        //   }
        // } else {
        //   // o message retorna todas as mensagens, tanto a enviada como a recebida, por isso estou filtrando
        //   console.log("Message from me");
        //   return;
        // }
      }
    });

    ig.realtime.on("error", (error) => {
      ig.realtime.disconnect();
      if(JSON.stringify(error).includes("MQTToTClient got disconnected")) {
        ig.realtime.connect(connectParams);
      }

      if(webhook){
        webhookTrigger({
          url: webhook.url,
          event: Events.SERVICE_DISCONNECTED,
          message: "Erro no serviço de Instagram",
          service: "instagram"
        });
      }
    });

    console.log(igConnect, "Connected to the Instagram Realtime API")
  } else {
    console.error("Failed to log in");
  }

  return { igClient: ig };
};

export default intagramService;
