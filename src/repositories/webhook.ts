import { mongoErrorHandler } from "../helpers/errorHandler";
import webhookModel from "../models/webhook/webhookModel";

export const createWebhook = async ({ url, companyId }: { url: string; companyId: string; }) => {
  try {
    const webhook = webhookModel.create({
      url,
      companyId,
    });

    return webhook;
  } catch (error) {
    mongoErrorHandler(error);
  }
};

export const getWebhook = async ({ companyId }: { companyId: string; }) => {
  try {
    const webhook = await webhookModel.findOne({ companyId });
    return webhook;
  } catch (error) {
    mongoErrorHandler(error);
  }
}

