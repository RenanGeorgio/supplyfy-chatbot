// type FlowType = 'bot' | 'human' | 'other';
// type ServiceType = 'instagram' | 'facebook' | 'messenger';
// type ConversationStatus = 'active' | 'inactive' | 'completed';

// interface Client {
//   chatId: string;
//   service: ServiceType;
//   flow: FlowType;
//   status: ConversationStatus;
// }

// // Mapa para armazenar os clientes, onde a chave é o chatId
// const clients: Map<string, Client> = new Map();

// const getClients = (): Map<string, Client> => {
//   return new Map(clients);
// };

// const updateClient = (client: Client): void => {
//   if (!client.chatId || !client.service || !client.flow || !client.status) {
//     throw new Error('Dados do cliente incompletos');
//   }

//   clients.set(client.chatId, client);
// };

// const getClientByChatId = (chatId: string): Client | null => {
//   return clients.get(chatId) || null;
// };

// const setClientType = (chatId: string, clientType: FlowType): void => {
//   const client = getClientByChatId(chatId);
//   if (!client) {
//     throw new Error('Cliente não encontrado');
//   }

//   client.flow = clientType;
//   updateClient(client);
// };

// const setClientStatus = (chatId: string, status: ConversationStatus): void => {
//   const client = getClientByChatId(chatId);
//   if (!client) {
//     throw new Error('Cliente não encontrado');
//   }

//   client.status = status;
//   updateClient(client);
// };

// const isHumanClient = (chatId: string): boolean => {
//   const client = getClientByChatId(chatId);
//   if (!client) {
//     return false;
//   }

//   return client.flow === 'human';
// };

// const removeClient = (chatId: string): void => {
//   clients.delete(chatId);
// };

// const getClientsByType = (clientType: FlowType): Client[] => {
//   return Array.from(clients.values()).filter(client => client.flow === clientType);
// };

// const handleConversationFlow = (chatId: string): void => {
//   const client = getClientByChatId(chatId);
//   if (!client) {
//     throw new Error('Cliente não encontrado');
//   }

//   switch (client.flow) {
//     case 'bot':
//       console.log(`Cliente ${chatId} está no fluxo de atendimento com um bot.`);
//       break;
//     case 'human':
//       console.log(`Cliente ${chatId} está sendo atendido por um humano.`);
//       break;
//     case 'other':
//       console.log(`Cliente ${chatId} está em um atendimento alternativo.`);
//       break;
//     default:
//       console.log('Tipo de atendimento desconhecido.');
//       break;
//   }
// };

// export { 
//   getClients, 
//   updateClient, 
//   getClientByChatId, 
//   setClientType, 
//   setClientStatus, 
//   isHumanClient, 
//   removeClient, 
//   getClientsByType, 
//   handleConversationFlow 
// };
