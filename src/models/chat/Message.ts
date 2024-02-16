import mongoose from "../../database";

const { Schema } = mongoose;

const messageSchema = new Schema({
    origin: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    dest: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
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

const Message = mongoose.model("Message", messageSchema);

export default Message;