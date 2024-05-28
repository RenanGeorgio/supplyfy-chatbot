import mongoose from "../../database";
import { Platforms } from "../../types/enums";

const { Schema } = mongoose;

const chatSchema = new Schema({
  members: {
    type: Array,
    required: true,
  },
  origin: {
    platform: {
      type: String,
      required: true,
      enum: Platforms,
    },
    chatId: {
      type: String,
    },
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
});

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
