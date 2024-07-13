import { ConversationBot } from "./conversation/bot";
import { BotRecognizer } from "./nlp/botRecognizer";
import { BookingDialog } from "./dialogs/bookingDialog";
import { MainDialog } from "./dialogs/mainDialog";
import { conversationReferences, conversationState, userState } from "./adapter";

const botRecognizer = new BotRecognizer({});

const bookingDialog = new BookingDialog();
const dialog = new MainDialog(botRecognizer, bookingDialog);
const conversationBot = new ConversationBot(conversationState, userState, conversationReferences);

export { conversationBot };