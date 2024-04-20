import { Response } from "express";
import { botExist } from "../../repositories/bot";
import { userExist } from "../../repositories/user";
import { servicesActions, webhookPromiseHandler } from "../../services";
import { CustomRequest, IBotData } from "../../types";
import { getWebhook } from "../../repositories/webhook";

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