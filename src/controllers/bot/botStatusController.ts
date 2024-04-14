import { Response } from "express";
import { botExist } from "../../repositories/bot";
import { userExist } from "../../repositories/user";
import { servicesActions, webhookPromiseHandler } from "../../services";
import { CustomRequest, IBotData } from "../../types";
import { webhookTrigger } from "../../services/webhook/webhookTrigger";
import { getWebhook } from "../../repositories/webhook";
import { start } from "repl";

const actionMessages = {
  start: "Iniciando serviço",
  stop: "Parando serviço",
  resume: "Resumindo serviço",
};

export const action = async (req: CustomRequest, res: Response) => {
  try {
    const { serviceId, action } = req.params;

    const checkUser = await userExist(req.user?.sub as string);
    const companyId = checkUser?.companyId as string;

    const bot = (await botExist("companyId", companyId)) as IBotData | null;

    if (!bot) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }

    servicesActions.socket.start(bot.socket);
    const service = bot.services[serviceId];
    const serviceControl = servicesActions[serviceId];

    if (!serviceControl) {
      res.status(400).json({ message: "Serviço fornecido é inválido" });
    }

    if (!serviceControl[action]) {
      // rotas unificadas, com um parâmetro para identificar a ação
      return res.status(400).json({ message: "Ação fornecida é inválida" });
    } else {
      const webhook = await getWebhook({ companyId });
      const control = serviceControl[action](service, webhook); // não estou esperando o retorno, para não travar a requisição

      if (webhook) {
        webhookPromiseHandler(webhook.url, control);
      }

      return res.status(200).json({
        message: `${actionMessages[action]}: ${serviceId}`,
      });
    }
  } catch (error) {
    return res.status(500);
  }
};

export const start = async (req: CustomRequest, res: Response) => {
  try {
    const { serviceId } = req.params;

    const checkUser = await userExist(req.user?.sub as string);
    const companyId = checkUser?.companyId as string;

    const bot = await botExist("companyId", companyId) as IBotData | null;
 
    if (!bot ) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }
    
    const service = bot.services[serviceId]
    const serviceControl = servicesActions[serviceId];

    if (!serviceControl) {
      res.status(400).json({ message: "Serviço fornecido é inválido" });
    }

    serviceControl.start(service); // não estou esperando o retorno, para não travar a requisição
    
    return res.status(200).json({ message: `Iniciando serviço: ${serviceId}` });
  } catch (error) {
    return res.status(500);
  }
};

// resume e stop podem ser unificados em um só método, passando um parâmetro(query) para identificar a ação
export const stop = async (req: CustomRequest, res: Response) => {
  try {
    const { service } = req.params;
    const { id } = req.body;

    const checkUser = await userExist(req.user?.sub as string);
    const companyId = checkUser?.companyId as string;

    const companyBot = await botExist("companyId", companyId);

    if (!companyBot) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }

    if (!id) {
      return res.status(400).json({ message: "Identificação não fornecida" });
    }

    const serviceControl = servicesActions[service];

    if (!serviceControl) {
      res.status(400).json({ message: "Serviço fornecido é inválido" });
    }

    const bot = await serviceControl.stop(id);

    if (!bot) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }

    return res.status(200).json({ message: `Bot foi parado` });
  } catch (error) {
    return res.status(500);
  }
};

export const resume = async (req: CustomRequest, res: Response) => {
  try {
    const { service } = req.params;

    const checkUser = await userExist(req.user?.sub as string);
    const companyId = checkUser?.companyId as string;

    const checkBot = await botExist("companyId", companyId) as IBotData | null;
 
    if (!checkBot) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }
    const { _id } = checkBot.services[service]
    const serviceControl = servicesActions[service];

    if (!serviceControl) {
      res.status(400).json({ message: "Serviço fornecido é inválido" });
    }

    const bot = await serviceControl.resume(_id);
    
    if(!bot) {
      return res.status(404).json({ message: "Instância do bot não encontrada" });
    }

    return res.status(200).json({ message: `Bot foi iniciado` });
  } catch (error) {
    return res.status(500);
  }
};