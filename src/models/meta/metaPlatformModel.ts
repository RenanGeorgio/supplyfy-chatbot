import mongoose from "../../database";

const { Schema } = mongoose;

const metaPlatformSchema = new Schema(
  {
    whatsapp: {
      messageTemplates: [
        {
          templateId: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            required: true,
          },
        },
      ],
    },
    companyId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const metaPlatformModel = mongoose.model("MetaPlataform", metaPlatformSchema);

export default metaPlatformModel;
