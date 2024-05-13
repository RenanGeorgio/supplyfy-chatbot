import { Kafka, KafkaConfig } from 'kafkajs';

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.replace(/[\\"]/g, '') : ""

const kafkaConfig: KafkaConfig = {
    brokers: [brokers],
    sasl: {
        mechanism: 'scram-sha-512',
        username: 'admin-user',
        password: 'bBr83ydttaTQ1WlCvwkrS4VezeqaCX43'
    }
}
const kafka = new Kafka(kafkaConfig)

export default kafka;