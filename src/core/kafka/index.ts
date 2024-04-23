import consume from "./consumer";
import { produce } from "./producer";

consume()
    .then(() => {
        console.log('Kafka consumer is running...');
    })
    .catch((error) => {
        console.error('Failed to run kafka consumer', error);
    });

produce('logs', { value: 'TESTE' })
    .then(() => {
        console.log('Kafka message sended...');
    })
    .catch((error) => {
        console.error('Failed to run kafka producer', error);
    });