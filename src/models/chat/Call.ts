import mongoose from "../../database";

const { Schema } = mongoose;

const callSchema = new Schema({
    protocol: {
        type: String,
        required: true,
    },
    messages: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
        default: [], 
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

const Call = mongoose.model("Call", callSchema);

export default Call;