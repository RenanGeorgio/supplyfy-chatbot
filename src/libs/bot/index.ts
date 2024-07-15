import { BotRecognizer } from "./nlp/botRecognizer";
import { BookingDialog } from "./dialogs/conversationDialog";
import { MainDialog } from "./dialogs/mainDialog";
import { conversationReferences, conversationState, userState } from "./adapter";
import { BotRoom } from "./conversation/room";

const botRecognizer = new BotRecognizer({});

const bookingDialog = new BookingDialog();
const dialog = new MainDialog(userState, botRecognizer, bookingDialog); // COMPARAR OQ userState AGREGOU NESTE EXEMPLO
const conversationBot = new BotRoom(conversationState, userState, conversationReferences, dialog);

export { conversationBot };