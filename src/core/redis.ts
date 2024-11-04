import * as redis from 'redis';

const redisConfig: any = {
  host: process.env.REDIS_HOST ? process.env.REDIS_HOST.replace(/[\\"]/g, '') : 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT.replace(/[\\"]/g, '')) : 6379,
  password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD.replace(/[\\"]/g, '') : undefined,
  tls: process.env.REDIS_TLS ? (/true/).test(process.env.REDIS_TLS.replace(/[\\"]/g, '')) : false
};

const redisClient = redis.createClient({
  disableOfflineQueue: true,
  pingInterval: 60000,
  socket:{
    host: redisConfig.host,
    port: redisConfig.port,
    tls: redisConfig.tls
  },    
  ...(redisConfig.password ? {password: redisConfig.password} : {}),
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

(async () => {await redisClient.connect().catch((err) => console.log(err)) })();

export { redisClient, redisConfig };
