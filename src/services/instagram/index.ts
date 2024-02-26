import { GraphQLSubscriptions } from "instagram_mqtt";
import { processQuestion } from "../../helpers/trainModel";
import instagramLogin from "./auth/session";

const intagramService = async () => {
    const { ig } = await instagramLogin();

    if (ig) {
        ig.realtime.on('message', async (msg) => {
          if (!msg.realtime) {
            const { message } = msg;
            
            const responseMessage = await processQuestion(message.text!);
            const thread = ig.entity.directThread([message.user_id.toString()]);

            await thread.broadcastText(responseMessage);
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

        console.log('Connected to instagram realtime!');
    } else {
        console.error('Failed to log in');
    }
}

export default intagramService;