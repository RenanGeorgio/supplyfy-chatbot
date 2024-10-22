import mongoose from "../../database";

const { Schema } = mongoose;

const apiTokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
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

const apiTokenModel = mongoose.model("apiTokens", apiTokenSchema);

export default apiTokenModel;