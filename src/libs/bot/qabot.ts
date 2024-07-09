import { ActivityHandler, ActivityTypes, ConversationState, TurnContext, UserState } from 'botbuilder';
import { processQuestion } from '../nlp/trainModel'

class QABot extends ActivityHandler {
    private conversationState: ConversationState;
    private userState: UserState;

    constructor(conversationState: ConversationState, userState: UserState) {
        super();

        this.userState = userState as UserState;
        this.conversationState = conversationState as ConversationState;

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if (membersAdded) {
                for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                    if (membersAdded[cnt].id !== context.activity.recipient.id) {
                        await context.sendActivity('Hello and Welcome');
                    }
                }
            }
            await next();
        });

        // this.onMembersRemoved(async (context, next) => {
        //     const membersRemoved = context.activity.membersRemoved;
        //     if (membersRemoved){
        //         for (const idx in membersRemoved) {
        //             if (membersRemoved[idx].id !== context.activity.recipient.id) {
        //                 await context.sendActivity('Welcome');
        //                 //await this._userState.ClearStateAsync(turnContext, cancellationToken);
        //             }
        //         }
        //     }
        //     await next();
        // });

        this.onMessage(async (context, next) => {
            const response = await processQuestion(context.activity.text);
            console.log(response)
            
            // const activity = { type: ActivityTypes.Message, text: response, from: { id, name }}
            const activity = { type: ActivityTypes.Message, text: response }
            await context.sendActivity(activity);
            console.log("Posted answer activity")
            console.log(context.activity)
            await next();
        });
    }

    public async run(context: TurnContext): Promise<void> {
        await super.run(context);

        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}

export default QABot;