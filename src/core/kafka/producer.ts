import { CustomMessageKafka } from '../../types';
import kafka from './kafka';
import { Message, Producer } from 'kafkajs';

const producer: Producer = kafka.producer();

export const produceMessage = async (customMessage: CustomMessageKafka) => {
    const message: Message = { key: "message", value: customMessage.text, headers: { from: customMessage.from, to: customMessage.to, service: customMessage.service, time: new Date().toISOString() } };
    await produce(customMessage.topic, message)
        .then(() => {
            console.log('Kafka message sended...');
        })
        .catch((error) => {
            console.error('Failed to run kafka producer', error);
        });
}

export const produce = async (topic: string, message: Message) => {
    await producer.connect();
    await producer.send({
        topic: topic,
        messages: [
            message
        ]
    });
}