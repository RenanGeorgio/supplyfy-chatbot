import { createClient } from "redis";

console.log(process.env.REDIS_PASSWORD)

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket:{
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
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
