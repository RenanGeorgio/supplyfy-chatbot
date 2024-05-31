import mongoose from "../../database";

const { Schema } = mongoose;

const chatClientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: { // numero, email, etc
        type: String,
        required: true,
    },
    senderPhone: {
        type: String,
        // required: true,
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

const chatClientModel = mongoose.model("chatClient", chatClientSchema);

export default chatClientModel;