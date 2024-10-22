import mongoose from "../../database";

const { Schema } = mongoose;

const chatSessionSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresDate: {
    type: Date,
    required: true,
  },
  companyId: {
    type: String,
    ref: "Company",
    required: true,
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

const chatSessionModel = mongoose.model("ChatSession", chatSessionSchema);

export default chatSessionModel;