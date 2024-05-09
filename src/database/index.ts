import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL ?? "").then(() => { console.log("Database connected!") }).catch((err) => {console.log(err.message)});
mongoose.Promise = global.Promise;

export default mongoose;