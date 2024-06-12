import { timeStamp } from "console";
import mongoose from "../../database";
import { create } from "domain";

const { Schema } = mongoose;

const typebotSchema = new Schema({
  typebotId: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
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

const typebotModel = mongoose.model("Typebot", typebotSchema);

export default typebotModel;