import Queue from "bull";
import * as jobs from "../jobs";

const redisConfig: any = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
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
  add(name: string, data: any, serviceId?: string) {
    const queue = this.queues.find((queue) => queue.name === name);
    console.log(queue?.options);
    if (queue) {
      return queue.bull.add({...data, serviceId}, queue.options);
      // estou adicionando o serviceId para poder identificar qual bot está enviando a mensagem
      // para funções mais simples, não é necessário passar o serviceId
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
