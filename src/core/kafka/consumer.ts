import kafka from './kafka';
import { Consumer, EachMessagePayload } from 'kafkajs';

const consumer: Consumer = kafka.consumer({ groupId: 'test-group' });

const consume = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'logs', fromBeginning: true })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
            console.log({
                value: message.value?.toString(),
            })
        }
    })
}

export default consume;