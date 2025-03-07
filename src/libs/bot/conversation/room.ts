import { BotState, UserState } from "botbuilder";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { MainDialog } from "../dialogs/mainDialog";
import { ConversationBot } from "./bot";

export class BotRoom extends ConversationBot {
  constructor(conversationState: BotState, userState: UserState, conversationReferences: any, currentManager: any, dialog?: Dialog) {
    super(conversationState, userState, conversationReferences, currentManager, dialog);

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (const idx in membersAdded) {
        if (membersAdded[idx].id !== context.activity.recipient.id) {
          await currentManager.createConversation("id da conversa");

          await context.sendActivity('Welcome');
          await (dialog as MainDialog).run(context, conversationState.createProperty<DialogState>('DialogState'));
        }
      }

      await next();
    });

    this.onMembersRemoved(async (context, next) => {
      const membersRemoved = context.activity.membersRemoved;
      for (const idx in membersRemoved) {
          if (membersRemoved[idx].id !== context.activity.recipient.id) {
            await currentManager.deleteConversation("id da conversa");
            //await this._userState.ClearStateAsync(turnContext, cancellationToken);
          }
      }

      await next();
  });
  }
}