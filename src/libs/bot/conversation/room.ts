import { BotState } from "botbuilder";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { MainDialog } from "../dialogs/mainDialog";
import { ConversationBot } from "./bot";

export class BotRoom extends ConversationBot {
  constructor(conversationState: BotState, userState: BotState, conversationReferences?: any, dialog?: Dialog) {
    super(conversationState, userState, conversationReferences, dialog);

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (const idx in membersAdded) {
        if (membersAdded[idx].id !== context.activity.recipient.id) {
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
            //await this._userState.ClearStateAsync(turnContext, cancellationToken);
          }
      }

      await next();
  });
  }
}