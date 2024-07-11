import { BotState } from 'botbuilder';
import { Dialog, DialogState } from 'botbuilder-dialogs';
import { MainDialog } from './dialogs/mainDialog';
import { ConversationBot } from './conversation';

export class DialogAndWelcomeBot extends ConversationBot {
  constructor(conversationState: BotState, userState: BotState, dialog: Dialog) {
    super(conversationState, userState, dialog);

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
  }
}