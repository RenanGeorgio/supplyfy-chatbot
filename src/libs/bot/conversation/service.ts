import { Activity, ActivityHandler, ActivityTypes, BotState, ConversationReference, TurnContext, UserState } from "botbuilder";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { MainDialog } from "../dialogs/mainDialog";
import { ContainerType } from "../types";
import { ContainerService } from "../container";
// import { ConversationBot } from "./bot";

async function logMessageText(storage, context) {
  let utterance = context.activity.text;
  try {
    let storeItems = await storage.read(["UtteranceLogJS"]);
    var UtteranceLogJS = storeItems["UtteranceLogJS"];
    if ((typeof (UtteranceLogJS)) != 'undefined') {
      storeItems["UtteranceLogJS"].turnNumber++;
      storeItems["UtteranceLogJS"].UtteranceList.push(utterance);
      var storedString = storeItems.UtteranceLogJS.UtteranceList.toString();
      var numStored = storeItems.UtteranceLogJS.turnNumber;
      try {
        await storage.write(storeItems);
        await context.sendActivity(`${numStored}: The list is now: ${storedString}`);
      } catch (err) {
        await context.sendActivity(`Write failed of UtteranceLogJS: ${err}`);
      }
    } else {
      await context.sendActivity(`Creating and saving new utterance log`);
      var turnNumber = 1;
      storeItems["UtteranceLogJS"] = { UtteranceList: [`${utterance}`], "eTag": "*", turnNumber }
      var storedString = storeItems.UtteranceLogJS.UtteranceList.toString();
      var numStored = storeItems.UtteranceLogJS.turnNumber;
      try {
        await storage.write(storeItems);
        await context.sendActivity(`${numStored}: The list is now: ${storedString}`);
      } catch (err) {
        await context.sendActivity(`Write failed: ${err}`);
      }
    }
  } catch (err) {
    await context.sendActivity(`Read rejected. ${err}`);
  }
}

export class BotService extends ActivityHandler {
  public conversationReferences: ConversationReference[];
  private conversationState: BotState;
  private userState: UserState;
  // private container: ContainerType;

  /**
   *
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {ConversationReference[]} conversationReferences
   */
  constructor(conversationState: BotState, userState: UserState, conversationReferences: ConversationReference[]) {
    super();
    if (!conversationState) throw new Error('[BotService]: Missing parameter. conversationState is required');
    if (!userState) throw new Error('[BotService]: Missing parameter. userState is required');
    this.conversationReferences = conversationReferences
    this.conversationState = conversationState
    this.userState = userState
    // this.container = ContainerService.getInstance()

    this.onMessage(async (context, next) => {
      console.log("Bot receive message...")
      this.addConversationReference(context.activity);
      // const text = context.activity.text.trim().toLocaleLowerCase();
      // if (text) {
        // const id = context.activity.from.id;
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
        // const answer = await this.container.executeConversation(id, text);
        const activity = { type: ActivityTypes.Message, text: "teste", from: { id: "321", name: "Bot genérico", role: "bot"} }
        await context.sendActivity(activity);
      // }
      await logMessageText(this.userState, context);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      console.log("Member added...")
      const membersAdded = context.activity.membersAdded;
      if (membersAdded) {
        for (let cnt = 0; cnt < membersAdded.length; cnt++) {
          if (membersAdded[cnt].id !== context.activity.recipient.id) {
            await context.sendActivity('Hello and Welcome');
            // await this.container.createConversation("id da conversa");
          }
        }
      }
      
      await next();
    });

    this.onMembersRemoved(async (context, next) => {
      const membersRemoved = context.activity.membersRemoved;
      for (const idx in membersRemoved) {
        if (membersRemoved[idx].id !== context.activity.recipient.id) {
          await context.sendActivity('Bye');
          // await this.container.deleteConversation("id da conversa");
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
    console.log("Bot service running...")
    await super.run(context);
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}