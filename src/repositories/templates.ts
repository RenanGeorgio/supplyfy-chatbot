import { mongoErrorHandler } from "../helpers/errorHandler";
import templatesModel from "../models/templates/templatesModel";
import type { EmailTemplate } from "../types/types";

export async function createEmailTemplate(template: EmailTemplate) {
  try {
    const companyId = template.companyId;
    console.log(template)
    
    const checkTemplate = await templatesModel.findOne({
      companyId: companyId,
    });

    if (checkTemplate) {
      return await templatesModel.findOneAndUpdate({
        companyId: companyId,
      }, {
        $set: {
          "email": template,
        }
      }, {
        new: true,
        runValidators: true
      });
    }

    return await templatesModel.create(template);
  } catch (error) {
    return mongoErrorHandler(error);
  }
}

export async function updateEmailTemplate(
  templateId: string,
  template: EmailTemplate
) {
  try {
    return await templatesModel.findByIdAndUpdate(templateId, template, {
      new: true,
    });
  } catch (error) {
    return mongoErrorHandler(error);
  }
}

export async function removeEmailTemplate(templateId: string) {
  try {
    return await templatesModel.findByIdAndDelete(templateId);
  } catch (error) {
    return mongoErrorHandler(error);
  }
}
