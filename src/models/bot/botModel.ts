import mongoose from "../../database";

const { Schema } = mongoose;

const instagramSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const telegramSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

const emailSchema = new Schema({
  imapHost: {
    type: String,
    required: true,
  },
  imapPort: {
    type: Number,
    required: true,
  },
  imapTls: {
    type: Boolean,
    required: true,
  },
  smtpHost: {
    type: String,
    required: true,
  },
  smtpPort: {
    type: Number,
    required: true,
  },
  smtpSecure: {
    type: Boolean,
    required: true
  },
  emailUsername: {
    type: String,
    required: true,
  },
  emailPassword: {
    type: String,
    required: true,
  }
});

const botSchema = new Schema({
  companyId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  },
  services: {
    telegram: {
      _id: { auto: false },
      type: telegramSchema,
    },
    instagram: {
      _id: { auto: false },
      type: instagramSchema,
    },
    email: {
      _id: { auto: false },
      type: emailSchema,
    },
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
