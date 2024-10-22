import mongoose from "../../database";

const { Schema } = mongoose;

const chatClientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    username: {
      // identificador: numero, email, username(instagram) etc
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    phone: { type: String },
    address: {
      street: { type: String },
      number: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    email: { type: String },
    //   metadata: {
    //     service: { type: String },
    //     tags: [String],
    //   }
  },
  { timestamps: true }
);

const chatClientModel = mongoose.model("chatClient", chatClientSchema);

export default chatClientModel;
