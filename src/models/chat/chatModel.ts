import mongoose from "../../database";

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
      enum: ["facebook", "instagram", "telegram", "web", "whatsapp"],
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