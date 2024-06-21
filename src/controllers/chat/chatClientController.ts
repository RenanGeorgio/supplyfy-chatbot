import { NextFunction, Response } from "express";
import ChatClientModel from "../../models/chat/chatClientModel";
import { createChatClient } from "../../repositories/chatClient";
import { CustomRequest } from "../../types";
import { userExist } from "../../repositories/user";

export const listClients = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // todo: filtrar com o token do usuário
    const clients = await ChatClientModel.find();

    return res.status(200).json(clients);
  } catch (error: any) {
    next(error)
  }
};

export const createClient = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = await userExist(req.user?.sub as string);
  if (!user) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  const { name, lastName, username } = req.body;

  if (!name || !username || !user) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const client = await createChatClient(username, name, lastName || " ");

    return res.status(201).json(client);
  } catch (error: any) {
    next(error)
  }
};

export const findClientByEmail = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { username } = req.params;

  try {
    const client = await ChatClientModel.findOne({
      username,
    });

    if (client) {
      return res.status(200).send(client);
    }

    return res.status(404).send("Chat user not found");
  } catch (error: any) {
    next(error)
  }
};

export const findClientById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { _id } = req.params;

  try {
    const client = await ChatClientModel.findOne({
      _id,
    });

    if (client) {
      return res.status(200).json(client);
    }

    return res.status(404).send("Chat user not found");
  } catch (error: any) {
    next(error)
  }
};
