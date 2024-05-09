import * as redis from 'redis';

const redisConfig: any = {
  host: process.env.REDIS_HOST ?? "redis",
  port: parseInt(process.env.REDIS_PORT ?? "6379"),
  password: process.env.REDIS_PASSWORD ?? ""
};

const redisClient = redis.createClient({
  password: redisConfig.password,
  socket:{
    host: redisConfig.host,
    port: redisConfig.port,
  },    
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

redisClient.connect().catch((err) => console.log(err))

export { redisClient, redisConfig };
