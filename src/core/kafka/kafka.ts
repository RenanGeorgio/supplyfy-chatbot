import { Kafka, KafkaConfig } from 'kafkajs';

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.replace(/[\\"]/g, '') : ""
const username = process.env.KAFKA_USERNAME || "";
const password = process.env.KAFKA_PASSWORD || "";

const kafkaConfig: KafkaConfig = {
    brokers: [brokers], 
    sasl: {
        mechanism: 'scram-sha-512',
        username: username.replace(/[\\"]/g, ''),
        password: password.replace(/[\\"]/g, '')
    }
}
const kafka = new Kafka(kafkaConfig)

export default kafka;