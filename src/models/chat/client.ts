import mongoose from "../../database";

const { Schema } = mongoose;

// info: a ideia é que sempre que um cliente iniciar uma conversa, ele seja cadastrado para vincular as mensagens a ele etc
const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
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

const ClientModel = mongoose.model("Client", clientSchema);

export default ClientModel;