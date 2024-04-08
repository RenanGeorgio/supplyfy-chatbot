import mongoose from "../../database";

const { Schema } = mongoose;

const webhookSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    companyId: {
        type: String,
        required: true,
        unique: true,
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

const webhookModel = mongoose.model("Webhook", webhookSchema);

export default webhookModel;