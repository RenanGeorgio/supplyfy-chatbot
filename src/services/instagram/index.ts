import { GraphQLSubscriptions } from "instagram_mqtt";
import { processQuestion } from "../../libs/trainModel";
import instagramLogin from "./auth/session";

const intagramService = async () => {
    const { ig } = await instagramLogin();

    if (ig) {
        ig.realtime.on('message', async (msg) => {
          if (msg.realtime) {
            const { message } = msg;
            
            const responseMessage = await processQuestion(message.text!);
            // const thread = ig.entity.directThread([String(message.user_id)]);

            // await thread.broadcastText(responseMessage);
            try {
              await ig.realtime.direct.sendText({threadId: String(message.thread_id), text: responseMessage})
            } catch (error) {
              console.error('Error while trying to send the message', error);
            }
         
            console.log(message)
            console.log(responseMessage)
          }
        });
    
        ig.realtime.on('error', console.error);

        await ig.realtime.connect({
            graphQlSubs: [
              GraphQLSubscriptions.getAppPresenceSubscription(),
              GraphQLSubscriptions.getDirectTypingSubscription(ig.state.cookieUserId),
            ],
            irisData: await ig.feed.directInbox().request(),
        });

            // simulate turning the device off after 2s and turning it back on after another 2s
          setTimeout(() => {
            console.log('Device off');
            // from now on, you won't receive any realtime-data as you "aren't in the app"
            // the keepAliveTimeout is somehow a 'constant' by instagram
            ig.realtime.direct.sendForegroundState({
                inForegroundApp: false,
                inForegroundDevice: false,
                keepAliveTimeout: 900,
            });
        }, 2000);
        setTimeout(() => {
            console.log('In App');
            ig.realtime.direct.sendForegroundState({
                inForegroundApp: true,
                inForegroundDevice: true,
                keepAliveTimeout: 60,
            });
        }, 4000);
        console.log('Connected to instagram realtime!');
    } else {
        console.error('Failed to log in');
    }
}

export default intagramService;