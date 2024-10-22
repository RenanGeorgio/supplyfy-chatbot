// criar um template, listar templates, atualizar template, deletar template

import { Request, Response, NextFunction } from "express";
import whatsappCloudApi from "../../../api/whatsapp";
import {
  createWhastappTemplate,
  removeWhastappTemplate,
} from "../../../repositories/meta/watsapp";
import { CustomRequest, IMongoErrorHandler } from "../../../types";
import { whatsappMsgTemplateApi } from "../service";
import { botExist } from "../../../repositories/bot";
import { userExist } from "../../../repositories/user";

enum TemplateCategory {
  AUTHENTICATION = "AUTHENTICATION",
  MARKETING = "MARKETING",
  UTILITY = "UTILITY",
}

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // to-do: implementr transação
  const {
    name,
    category,
    components,
  }: {
    name: string;
    category: TemplateCategory;
    components: any[];
  } = req.body;

  try {
    if (!name || !category || !components) {
      return res.status(400).send({ message: "Campos obrigatórios ausentes" });
    }

    if (TemplateCategory[category] === undefined) {
      return res.status(400).send({ message: "Categoria inválida" });
    }

    const user = await userExist(req.user?.sub as string);

    const bot = await botExist("companyId", user?.companyId as string);
    const whatsappCrendentials = bot?.services?.whatsapp;

    if (!whatsappCrendentials?.businessId) {
      return res.status(400).send({ message: "Credenciais não encontradas" });
    }

    const whatsapp = await whatsappMsgTemplateApi({
      data: {
        name,
        category,
        components,
        // allow_category_change: true,
        language: "pt_BR",
      },
      wb: {
        wabaId: whatsappCrendentials.businessId,
        accessToken: whatsappCrendentials.accessToken,
      },
      method: "POST",
    });

    if (!whatsapp) {
      return res.status(400).send({ message: "Erro ao criar template" });
    }

    if (whatsapp.status !== 200) {
      return res.status(400).send(whatsapp.response.data.error);
    }

    const wppData = whatsapp.data;
    const createTemplate = await createWhastappTemplate({
      templateId: wppData.id,
      name,
      category: category,
      companyId: user?.companyId,
    });

    if (
      createTemplate &&
      "success" in createTemplate &&
      !createTemplate.success
    ) {
      return res
        .status(400)
        .send({ message: createTemplate.message, error: createTemplate.error });
    }
    return res.status(200).send({
      message: {
        templateId: wppData.id,
        name,
        category: wppData.category,
        status: wppData.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id, name } = req.query;
  // to-do: implementr transação
  try {
    if (!id || !name) {
      return res.status(400).send({ message: "Campos obrigatórios ausentes" });
    }

    const user = await userExist(req.user?.sub as string);

    const bot = await botExist("companyId", user?.companyId as string);

    const whatsappCrendentials = bot?.services?.whatsapp;

    if (!whatsappCrendentials?.businessId) {
      return res.status(400).send({ message: "Credenciais não encontradas" });
    }

    const whatsapp = await whatsappMsgTemplateApi({
      wb: {
        wabaId: whatsappCrendentials.businessId,
        accessToken: whatsappCrendentials.accessToken,
      },
      query: `?hsm_id=${id}&name=${name}`,
      method: "DELETE",
    });

    if (!whatsapp) {
      return res.status(400).send({ message: "Erro ao criar template" });
    }

    if (whatsapp.status !== 200) {
      return res.status(400).send(whatsapp.response.data.error);
    }

    const removeTemplate = await removeWhastappTemplate({
      templateId: id as string,
      name: name as string,
      companyId: user?.companyId as string,
    });

    if (
      removeTemplate &&
      "success" in removeTemplate &&
      !removeTemplate.success
    ) {
      return res.status(400).send({ message: removeTemplate.message });
    }

    return res.status(200).send({ message: "Template deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};
