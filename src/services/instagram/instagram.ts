import { GraphQLSubscriptions, IgApiClientRealtime } from "instagram_mqtt";
import { processQuestion } from "../../libs/trainModel";

const intagramService = async (ig: IgApiClientRealtime) => {
  if (ig) {
    const userId = ig.state.cookieUserId;

    const connectParams = 
      {
        graphQlSubs: [
          GraphQLSubscriptions.getAppPresenceSubscription(),
          GraphQLSubscriptions.getDirectTypingSubscription(ig.state.cookieUserId),
        ],
        irisData: await ig.feed.directInbox().request(),
        autoReconnect: true,
    }

    const igConnect = await ig.realtime.connect(connectParams);

    ig.realtime.on("message", async (msg) => {
      if (msg.realtime) {
        const { message } = msg;
        const { thread_id, user_id, text } = message;

        if (user_id && user_id.toString() !== userId) {
          try {
            const responseMessage = await processQuestion(text as string);
            await ig.entity
              .directThread([String(user_id)])
              .broadcastText(responseMessage);
          } catch (error) {
            console.error("Error while trying to send the message", error);
          }
        } else {
          // o message retorna todas as mensagens, tanto a enviada como a recebida, por isso estou filtrando
          console.log("Message from me");
          return;
        }
      }
    });

    ig.realtime.on("error", (error) => {
      ig.realtime.disconnect();
      if(JSON.stringify(error).includes("MQTToTClient got disconnected")) {
        ig.realtime.connect(connectParams);
      }

    });

    console.log(igConnect, "Connected to the Instagram Realtime API")
    // simulate turning the device off after 2s and turning it back on after another 2s
    // setTimeout(() => {
    //   console.log("Device off");
    //   // from now on, you won't receive any realtime-data as you "aren't in the app"
    //   // the keepAliveTimeout is somehow a 'constant' by instagram
    //   ig.realtime.direct.sendForegroundState({
    //     inForegroundApp: false,
    //     inForegroundDevice: false,
    //     keepAliveTimeout: 900,
    //   });
    // }, 2000);
    // setTimeout(() => {
    //   console.log("In App");
    //   ig.realtime.direct.sendForegroundState({
    //     inForegroundApp: true,
    //     inForegroundDevice: true,
    //     keepAliveTimeout: 60,
    //   });
    // }, 4000);
  } else {
    console.error("Failed to log in");
  }

  return { igClient: ig };
};

export default intagramService;
