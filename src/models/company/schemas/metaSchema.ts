import mongoose from "../../../database";

const { Schema } = mongoose;

export default new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
  reauthorizeRequiredIn: {
    type: Number,
    required: true,
  },
  signedRequest: {
    type: String,
    required: true,
  },
  tokenType: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  // verificar necessidade de mais campos
});
