import mongoose from "../../database";

const { Schema } = mongoose;

const templatesSchema = new Schema(
  {
    email: [
      {
        name: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        properties: {
          backgroundColor: {
            type: String,
            required: true,
          },
          textColor: {
            type: String,
            required: true,
          },

          borderColor: {
            type: String,
            required: true,
          },
          fontSize: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          textAlign: {
            type: String,
            required: true,
          },
          fontFamily: {
            type: String,
            required: true,
          },
          padding: {
            type: String,
            required: true,
          },
          margin: {
            type: String,
            required: true,
          },
          imageUrl: {
            type: String,
            required: true,
          },
        },
      },
    ],
    companyId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const templatesModel = mongoose.model("Templates", templatesSchema);

export default templatesModel;
