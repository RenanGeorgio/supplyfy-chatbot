import { Activity, ActivityHandler, ActivityTypes, BotState, ConversationReference, TurnContext, UserState } from "botbuilder";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { MainDialog } from "../dialogs/mainDialog";
import { ManagerType } from "../types";
// import { ConversationBot } from "./bot";

export class BotRoom extends ActivityHandler {
  public conversationReferences: ConversationReference[];
  private conversationState: BotState;
  private userState: UserState;
  private currentManager: ManagerType;

  /**
   *
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {ConversationReference[]} conversationReferences
   * @param {ManagerType} currentManager
   */
  constructor(conversationState: BotState, userState: UserState, conversationReferences: ConversationReference[], currentManager: ManagerType) {
    super();
    this.conversationReferences = conversationReferences
    this.conversationState = conversationState
    this.userState = userState

    this.onMessage(async (context, next) => {
      console.log("Bot receive message...")

      this.addConversationReference(context.activity);
      const text = context.activity.text.trim().toLocaleLowerCase();
      if (text) {
        const id = context.activity.from.id;
        // if (userProfile){
        //   userProfile.userId = id;
        //   userProfile.userName = context.activity.from.name;
        //   userProfile.info = context.activity?.value;
        // }
        // if (conversationData){
        //   conversationData.timestamp = context.activity.timestamp;
        //   conversationData.locale = context.activity.locale;
        //   conversationData.channelId = context.activity.channelId;
        // }
        this.currentManager.setModel('./model.nlp');
        const answer = await this.currentManager.executeConversation(id, text);
        const activity = { type: ActivityTypes.Message, text: answer }
        await context.sendActivity(activity);
      }
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (const idx in membersAdded) {
        if (membersAdded[idx].id !== context.activity.recipient.id) {
          await currentManager.createConversation("id da conversa");
        }
      }

      await next();
    });

    this.onMembersRemoved(async (context, next) => {
      const membersRemoved = context.activity.membersRemoved;
      for (const idx in membersRemoved) {
        if (membersRemoved[idx].id !== context.activity.recipient.id) {
          await currentManager.deleteConversation("id da conversa");
        }
      }

      await next();
    });

    this.onConversationUpdate(async (context, next) => {
      this.addConversationReference(context.activity);
      await next();
    });
  }

  private addConversationReference(activity: Activity): void {
    const newConversationReference: ConversationReference = TurnContext.getConversationReference(activity) as ConversationReference;
    this.conversationReferences[newConversationReference.conversation.id] = newConversationReference;
  }

  public async run(context: TurnContext): Promise<void> {
    console.log("Bot running...")
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}