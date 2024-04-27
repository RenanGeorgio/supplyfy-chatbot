import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import Queue from "./Queue";
import { Router } from "express";

export default function (router: Router){
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/admin/queues");
  
  const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    serverAdapter: serverAdapter,
    queues: Queue.queues.map((queue) => new BullAdapter(queue.bull)),
  });

  router.use('/admin/queues', serverAdapter.getRouter());
}
