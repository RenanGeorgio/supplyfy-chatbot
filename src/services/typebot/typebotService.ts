// Ao clicar em publicar, o Typebot irá enviar uma requisição POST para a URL configurada e será iniciado o serviço do typebot.

// a instancia do typebotService devera interpretar o modelo gerado no typebot e iniciar o serviço

// o serviço será usado em todos os canais de comunicação, como telegram, whatsapp, email, facebook, instagram, etc.

//  o fluxo podera ser pausado a qualquer momento e redirecionado para outro fluxo(Modelo) ou para um atendente humano.

import { startChat } from "./session/chatSession";

export const typebotService = async (typebotId: string) => {
  const session = await startChat(typebotId);
  
  return session;
};