import Queue from "bull";
// import { redisConfig } from '../core/configs/redis';
import * as jobs from "../jobs";

const redisConfig: any = {
  // redis: {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // },
};

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, {
    redis: redisConfig,
    prefix: "messageQueue",
  }),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

export default {
  queues,
  add(name, data, cb?) {
    const queue = this.queues.find((queue) => queue.name === name);
    if (queue) {
      return queue.bull.add({...data, callback: cb}, queue.options);
      // todo: resolver o problema de passar o callback ou alterar a abordagem
    }
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle).catch((err) => console.log(err));

      queue.bull.on("failed", (job, err) => {
        console.log("job failed");
      });

      queue.bull.on("completed", (job, result) => {
        console.log("job completed", result);
      });
    });
  },
};
