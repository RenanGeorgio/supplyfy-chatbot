import { Response } from "express";
import { botExist } from "../../repositories/bot";
import { userExist } from "../../repositories/user";
import { servicesActions } from "../../services";
import { CustomRequest, IBotData } from "../../types";

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