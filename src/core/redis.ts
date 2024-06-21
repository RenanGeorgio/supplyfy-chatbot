import * as redis from 'redis';

const redisConfig: any = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379',
  password: process.env.REDIS_PASSWORD || ''
};

const redisClient = redis.createClient({
  password: redisConfig.password.replace(/[\\"]/g, ''),
  disableOfflineQueue: true,
  pingInterval: 60000,
  // descomentar antes de mandar para main
  // socket:{
  //   host: redisConfig.host.replace(/[\\"]/g, ''),
  //   port: parseInt(redisConfig.port.replace(/[\\"]/g, '')),
  //   tls: true
  // },    
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

(async () => {await redisClient.connect().catch((err) => console.log(err)) })();

export { redisClient, redisConfig };
