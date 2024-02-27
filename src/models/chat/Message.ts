import mongoose from "../../database";

const { Schema } = mongoose;

const messageSchema = new Schema({
  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;