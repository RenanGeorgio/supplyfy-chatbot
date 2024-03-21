import kafka from './kafka';
import { Message, Producer } from 'kafkajs';

const producer: Producer = kafka.producer();

const produce = async (topic: string , message: Message) => {
    await producer.connect();
    await producer.send({ topic: topic, 
        messages: [
            message
        ]
    });
}

export default produce;