import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = { brokers: [process.env.KAFKA_BROKERS || ""] }
const kafka = new Kafka(kafkaConfig)

export default kafka;