import { mongoErrorHandler } from "../helpers/errorHandler"
import chatSessionModel from "../models/chat/chatSession"

export async function createChatSession({ token, url, expiresDate, companyId }){
  try {

   const create = await chatSessionModel.create({
      token,
      url,
      expiresDate,
      companyId
    })

    if(!create){
      return { success: false, message: "Erro ao criar sessão de chat" }
    }

    return create;

  } catch (error: any) {
    mongoErrorHandler(error)
  }

}