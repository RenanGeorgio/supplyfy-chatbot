import { mongoErrorHandler } from "../../helpers/errorHandler";
import MetaModel from "../../models/meta/metaPlatformModel";

export const createWhastappTemplate = async ({
  templateId,
  name,
  category,
  companyId,
}) => {
  try {
    const metaModel = await MetaModel.findOne({ companyId });

    if (!metaModel) {
      const newMeta = new MetaModel({
        whatsapp: {
          messageTemplates: [
            {
              templateId,
              name,
              category,
            },
          ],
        },
        companyId,
      });

      await newMeta.save();

      return newMeta;
    }

    const meta = await MetaModel.findByIdAndUpdate(
      {
        _id: metaModel._id,
      },
      {
        $push: {
          "whatsapp.messageTemplates": {
            templateId,
            name,
            category,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return meta;
  } catch (error) {
    return mongoErrorHandler(error);
  }
};

export const removeWhastappTemplate = async ({
  templateId,
  name,
  companyId,
}: {
  templateId: string;
  name: string;
  companyId: string;
}) => {
  try {
    const metaModel = await MetaModel.findOne({
      companyId,
      "whatsapp.messageTemplates": { $elemMatch: { templateId } },
    });

    if (!metaModel) {
      return {
        success: false,
        message: "Meta não encontrado",
      };
    }

    await MetaModel.findOneAndUpdate(
      { _id: metaModel._id },
      { $pull: { "whatsapp.messageTemplates": { templateId } } },
      { safe: true, multi: false }
    );

    return {
      success: true,
      message: "Template removido",
    };
  } catch (error) {
    return mongoErrorHandler(error);
  }
};
