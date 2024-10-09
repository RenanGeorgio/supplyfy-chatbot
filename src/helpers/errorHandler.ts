import { Error } from "mongoose";
import { IMongoErrorHandler } from "../types/types";

export function mongoErrorHandler(error: any): IMongoErrorHandler {
  if (error instanceof Error.ValidationError) {
    const messages = Object.values(error.errors).map((err) => err.message);

    return {
      success: false,
      message:
        "Não foi possível processar a requisição devido a erros de validação",
      error: messages,
    };
  }

  if (error instanceof Error.CastError) {
    return {
      success: false,
      message:
        "Não foi possível processar a requisição devido a um erro de cast",
      error: error.message,
    };
  }

  if (error.code && error.code === 11000) {
    return {
      success: false,
      message:
        "Não foi possível processar a requisição devido a uma chave duplicada",
      error: error.message,
    };
  }

  return { success: false, message: "Internal server error", error };
}
