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
  username: {
    type: String,
    required: true,
  },
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
    required: true,
  },
  emailUsername: {
    type: String,
    required: true,
  },
  emailPassword: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    // required: true,
  },
});

const socketSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  auth: {
    token: {
      type: String,
      required: true,
    },
  },
});

const messengerSchema = new Schema({
  pageId: {
    type: String,
    required: true,
  },
  pageToken: {
    type: String,
    required: true,
  },
  verifyToken: {
    type: String,
    required: true,
  },
});

const botSchema = new Schema(
  {
    companyId: {
      type: String,
      required: true,
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
      facebook: {
        _id: { auto: false },
        type: messengerSchema,
      },
    },
    socket: {
      type: socketSchema,
    },
  },
  { timestamps: true }
);

const BotModel = mongoose.model("Bot", botSchema);

export default BotModel;
