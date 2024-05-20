import mongoose from 'mongoose';

const url = process.env.MONGO_URL ? process.env.MONGO_URL.replace(/[\\"]/g, '') : ""
console.log(url)
mongoose.connect(url).then(() => { console.log("Database connected!") }).catch((err) => { console.log(err.message) });
mongoose.Promise = global.Promise;

export default mongoose;