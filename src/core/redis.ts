import { createClient } from "redis";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket:{
    host: "0.0.0.0",
    port: 6379,
  }
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

(async () => {
  await redisClient.connect().catch(console.error)
})();

export { redisClient };
