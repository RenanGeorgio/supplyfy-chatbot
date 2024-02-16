import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL ?? "");
mongoose.Promise = global.Promise;

export default mongoose;