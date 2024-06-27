import { Types } from "mongoose";
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

export const findWebhook = async ({ companyId }: { companyId: string; }) => {
  try {
    const webhook = await webhookModel.findOne({ companyId });

    return webhook;
  } catch (error) {
    mongoErrorHandler(error);
  }
}

export const updateWebhook = async ({ _id, url }: { _id: string | Types.ObjectId; url: string; }) => {
  try {
    const webhook = await webhookModel.findByIdAndUpdate({ _id }, { url }, { new: true});

    return webhook;
  } catch (error) {
    mongoErrorHandler(error);
  }
}

