import { Kafka, KafkaConfig } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: async () => {
        const clusterResponse = await fetch(KAFKA_REST_URL, {
            headers: 'application/vnd.api+json',
        }).then(response => response.json())
        const clusterUrl = clusterResponse.data[0].links.self

        const brokersResponse = await fetch(`${clusterUrl}/brokers`, {
            headers: 'application/vnd.api+json',
        }).then(response => response.json())

        const brokers = brokersResponse.data.map(broker => {
            const { host, port } = broker.attributes
            return `${host}:${port}`
        })

        return brokers
    }
})

export default kafka;