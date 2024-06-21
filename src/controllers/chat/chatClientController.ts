import { Request, Response } from "express";
import ChatClientModel from "../../models/chat/chatClientModel";
import { createChatClient } from "../../repositories/chatClient";
import { CustomRequest } from "../../types";

export const listClients = async (req: Request, res: Response) => {
  try {
    // todo: filtrar com o token do usuário
    const clients = await ChatClientModel.find();

    return res.status(200).json(clients);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const createClient = async (req: CustomRequest, res: Response) => {
  const { name, lastName, username } = req.body;

  if (!name || !username) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const client = await createChatClient(username, name, lastName || " ");

    return res.status(201).json(client);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const findClientByEmail = async (req: Request, res: Response) => {
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
    res.status(500).send(error.message);
  }
};

export const findClientById = async (req: Request, res: Response) => {
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
    res.status(500).send(error.message);
  }
};
