import mongoose from "../../database";
import metaSchema from "./schemas/metaSchema";

const { Schema } = mongoose;

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true, // referencia ao id da empresa no user control ??
  },
  meta: {
    _id: { auto: false },
    type: metaSchema,
  }
});

const companyModel = mongoose.model("Company", companySchema);

export default companyModel;