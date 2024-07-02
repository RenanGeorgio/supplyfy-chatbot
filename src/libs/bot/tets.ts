const { ActivityHandler, MemoryStorage } = require('botbuilder');

// Process incoming requests - adds storage for messages.
class EchoBot extends ActivityHandler {
  constructor(myStorage) {
    super();
    this.storage = myStorage;
    // See https://learn.microsoft.com/azure/bot-service/bot-builder-basics to learn more about the message and other activity types.
    this.onMessage(async turnContext => { console.log('this gets called (message)');
      await turnContext.sendActivity(`You said '${ turnContext.activity.text }'`);
      // Save updated utterance inputs.
      await logMessageText(this.storage, turnContext);
    });

    this.onConversationUpdate(async turnContext => { console.log('this gets called (conversation update)');
    await turnContext.sendActivity('Welcome, enter an item to save to your list.'); });
  }
}

// This function stores new user messages. Creates new utterance log if none exists.
async function logMessageText(storage, turnContext) {
  let utterance = turnContext.activity.text;
  // debugger;
  try {
    // Read from the storage.
    let storeItems = await storage.read(["UtteranceLogJS"])
    // Check the result.
    var UtteranceLogJS = storeItems["UtteranceLogJS"];
    if (typeof (UtteranceLogJS) != 'undefined') {
      // The log exists so we can write to it.
      storeItems["UtteranceLogJS"].turnNumber++;
      storeItems["UtteranceLogJS"].UtteranceList.push(utterance);
      // Gather info for user message.
      var storedString = storeItems.UtteranceLogJS.UtteranceList.toString();
      var numStored = storeItems.UtteranceLogJS.turnNumber;

      try {
          await storage.write(storeItems)
          await turnContext.sendActivity(`${numStored}: The list is now: ${storedString}`);
      } catch (err) {
          await turnContext.sendActivity(`Write failed of UtteranceLogJS: ${err}`);
      }
    } else {
      await turnContext.sendActivity(`Creating and saving new utterance log`);
      var turnNumber = 1;
      storeItems["UtteranceLogJS"] = { UtteranceList: [`${utterance}`], "eTag": "*", turnNumber }
      // Gather info for user message.
      var storedString = storeItems.UtteranceLogJS.UtteranceList.toString();
      var numStored = storeItems.UtteranceLogJS.turnNumber;

      try {
        await storage.write(storeItems)
        await turnContext.sendActivity(`${numStored}: The list is now: ${storedString}`);
      } catch (err) {
        await turnContext.sendActivity(`Write failed: ${err}`);
      }
    }
  } catch (err) {
    await turnContext.sendActivity(`Read rejected. ${err}`);
  }
}

module.exports.EchoBot = EchoBot;