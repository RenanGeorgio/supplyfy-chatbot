import { mongoErrorHandler } from "../helpers/errorHandler";
import User from "../models/user/User";

export async function userExist(userId?: string) {
  try {
    if (!userId) return null;
    const user = await User.findOne({ _id: userId });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    mongoErrorHandler(error);
  }
}

export async function removeUser(userId: string) {
  try {
    const user = await User.findOneAndDelete({ _id: userId });
    return { success: true, message: "Usuário removido com sucesso" };
  } catch (error) {
    mongoErrorHandler(error);
  }
}

/**
 * verifica se o usuário existe
 * @param {string} path campo a ser pesquisado
 * @param {string} value valor a ser pesquisado
 */
export async function findUserByField(path: string, value: string) {
  try {
    const user = await User.findOne({ [path]: value });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    mongoErrorHandler(error);
  }
}