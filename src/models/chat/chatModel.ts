import mongoose from "../../database";
import { ChatStatus, Platforms } from "../../types/enums";

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
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
    status: {
      type: String,
      enum: ChatStatus,
      default: "active",
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
