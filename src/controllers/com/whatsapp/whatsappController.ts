import { Response, NextFunction } from "express";
import { createReadStream } from "fs";
import {
  CustomRequest,
  SendText,
  SendInterativeButton,
  SendInterativeList,
  SendContacts,
  SendImg,
  SendDoc
} from "../../../types";
import { msgStatusChange, sendMsg } from "../service";
import { whatsappCloudApi } from "../../../api";

export const markMessageAsRead = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { messageId } = req.body;
        
        const useWhatsappApi = whatsappCloudApi("v20.0", req.body.entry[0].changes[0].value.metadata.phone_number_id);

        const response = await msgStatusChange(messageId, useWhatsappApi);

        if (response?.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error: any) {
        next(error)
    }           
};

export const sendTextMessage = async (messageText: string, wb: any) => {
  const data: SendText = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: wb.recipientPhoneNumberId,
    type: 'text',
    text: {
      preview_url: false,
      body: messageText
    }
  }

  console.log("send text message called: " + messageText);
  try {
    const response = await sendMsg(data, wb);
    return response;
  } catch (error: any) {
    return null;
  }
};

export const sendButtonsMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { messageText, buttonsList } = req.body;

        const useWhatsappApi = whatsappCloudApi("v20.0", req.body.entry[0].changes[0].value.metadata.phone_number_id);

        const data: SendInterativeButton = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: req.body.entry[0].changes[0].value.messages[0],
          type: "text",
          interactive: {
            type: "button",
            body: {
              text: messageText,
            },
            action: {
              buttons: buttonsList.map((button) => ({
                type: "reply",
                reply: {
                  id: button.id,
                  title: button.title,
                },
              })),
            },
          },
        };

        const response = await sendMsg(data, useWhatsappApi);

        if (response?.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendContacts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { contactsList } = req.body;

        const useWhatsappApi = whatsappCloudApi("v20.0", req.body.entry[0].changes[0].value.metadata.phone_number_id);

        const data: SendContacts = {
          messaging_product: "whatsapp",
          to: req.body.entry[0].changes[0].value.messages[0],
          type: "text",
          contacts: contactsList,
        };

        const response = await sendMsg(data, useWhatsappApi);

        if (response?.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendRadioButtons = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { headerText, bodyText, footerText, sectionsList } = req.body;

        const useWhatsappApi = whatsappCloudApi("v20.0", req.body.entry[0].changes[0].value.metadata.phone_number_id);

        const data: SendInterativeList = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: req.body.entry[0].changes[0].value.messages[0],
          type: "text",
          interactive: {
            type: "list",
            header: {
              type: "text",
              text: headerText,
            },
            body: {
              text: bodyText,
            },
            footer: {
              text: footerText,
            },
            action: {
              button: "Select from the list",
              sections: sectionsList,
            },
          },
        };

        const response = await sendMsg(data, useWhatsappApi);

        if (response?.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendImageByLink = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { imageLink, caption } = req.body;

        const useWhatsappApi = whatsappCloudApi("v20.0", req.body.entry[0].changes[0].value.metadata.phone_number_id);

        const data: SendImg = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: req.body.entry[0].changes[0].value.messages[0],
          type: "text",
          image: {
            link: imageLink,
            caption: caption,
          },
        };

        const response = await sendMsg(data, useWhatsappApi);

        if (response?.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const uploadMedia = async (
    filePath: string,
    useWhatsappApi: any
) => {
    try {
        const data = new FormData();
        data.append("messaging_product", "whatsapp");
        data.append("file", createReadStream(filePath));

        const response = await useWhatsappApi("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
                // @ts-ignore
                ...data.getHeaders()
            },
            data: data
        });

        return response;
    } catch (error) {
        console.log(error);
    }           
};

export const sendDocumentMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { documentPath, caption } = req.body;

        const useWhatsappApi = whatsappCloudApi("v20.0", req.body.entry[0].changes[0].value.metadata.phone_number_id);

        const docId: any = await uploadMedia(documentPath, useWhatsappApi);

        const data: SendDoc = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: req.body.entry[0].changes[0].value.messages[0],
          type: "text",
          document: {
            caption: caption,
            filename: documentPath.split("./")[1],
            id: docId,
          },
        };

        const response = await sendMsg(data, useWhatsappApi);

        if (response?.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

/*
async function listTemplates() {
    return await axios({
      method: 'get',
      url: `https://graph.facebook.com/${apiVersion}/${myBizAcctId}/message_templates`
        + '?limit=1000',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
  }
  
async function createMessageTemplate(template) {
    console.log('name:'  +  process.env.TEMPLATE_NAME_PREFIX + '_' + template.name);

    const config = {
        method: 'post',
        url: `https://graph.facebook.com/${apiVersion}/${myBizAcctId}/message_templates`,
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        },
        data: {
        name:  process.env.TEMPLATE_NAME_PREFIX + '_' + template.name,
        category: template.category,
        components: template.components,
        language: template.language
        }
    };

    return await axios(config)
}
*/