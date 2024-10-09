import mongoose from "../../database";

const { Schema } = mongoose;

const typebotSchema = new Schema(
  {
    companyId: {
      type: String,
      required: true,
      ref: "User",
    },
    typebotId: {
      type: String,
      required: true,
      unique: true,
    },
    workspaceId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const typebotModel = mongoose.model("Typebot", typebotSchema);

export default typebotModel;
