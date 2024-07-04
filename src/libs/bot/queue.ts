import Queue from "bull";

const msgQueuev2 = new Queue('BOT-V2');
const msgQueuev1 = new Queue('BOT-V1');

const useVersion1 = false;

export { msgQueuev1, msgQueuev2, useVersion1 }