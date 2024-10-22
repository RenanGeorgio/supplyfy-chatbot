// to-do: alterar fluxo do consumidor por fora do serviço, 
// ex: cliente iniciou o chamado mandando mensagem para o consumidor, altera estado para "Atendimento humano"
let clients = new Map();

const getClients = () => {
  return new Map(clients);
};

const updateClient = (client) => {
  clients.set(client.chatId, client);
};

export { getClients, updateClient };