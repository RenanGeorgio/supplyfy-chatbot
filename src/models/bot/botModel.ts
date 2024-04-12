import mongoose from "../../database";

const { Schema } = mongoose;

const botSchema = new Schema({
  companyId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  services: {
    telegram: {
      token: {
        type: String,
        required: true,
      }
    },
    instagram: {
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BotModel = mongoose.model("Bot", botSchema);

export default BotModel;
