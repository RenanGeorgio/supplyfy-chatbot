import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
    brokers: [process.env.KAFKA_BROKERS || ""],
    sasl: {
        mechanism: 'scram-sha-512',
        username: 'admin-user',
        password: 'bBr83ydttaTQ1WlCvwkrS4VezeqaCX43'
    }
}
const kafka = new Kafka(kafkaConfig)

export default kafka;