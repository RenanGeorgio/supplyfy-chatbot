import * as redis from 'redis';

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket:{
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },    
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

export { redisClient };
