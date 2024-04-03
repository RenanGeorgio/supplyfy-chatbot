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
  } else {
    return { success: false, message: "Internal server error", error };
  }
}
