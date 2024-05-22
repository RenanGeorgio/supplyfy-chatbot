import * as redis from 'redis';

const redisConfig: any = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379',
  password: process.env.REDIS_PASSWORD || ''
};

const redisClient = redis.createClient({
  password: redisConfig.password.replace(/[\\"]/g, ''),
  pingInterval: 1000,
  disableOfflineQueue: true,
  socket:{
    host: redisConfig.host.replace(/[\\"]/g, ''),
    port: parseInt(redisConfig.port.replace(/[\\"]/g, '')),
    tls: true
  },    
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

redisClient.connect().catch((err) => console.log(err))

setInterval(async () => {
  try {
    const heartbeatKey = `heartbeat`;
    const read = redisClient.get(heartbeatKey);
    const timer = new Promise((resolve, reject) => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        reject('Interval Check Command Timeout YES');
      }, 2000);
    });
    const race = await Promise.race([read, timer]);
    redisClient.set(heartbeatKey, Date.now());
  } catch (error) {
    await redisClient.disconnect();
    await redisClient.connect().catch((err) => console.log(err))
    redisClient.set(`incident-${Date.now()}`, `${new Date()}`);
  }
}, 60000);

export { redisClient, redisConfig };
