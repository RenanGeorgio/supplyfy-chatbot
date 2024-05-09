import * as redis from 'redis';

console.log("Trying to connect on " + process.env.REDIS_HOST + ":"+ process.env.REDIS_PORT)

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket:{
    host: process.env.REDIS_HOST ?? "redis",
    port: parseInt(process.env.REDIS_PORT ?? "6379"),
  },    
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

redisClient.connect().catch(console.error)

export { redisClient };
