import { Response, NextFunction } from "express";
import { userExist } from "../../repositories/user";
import { botExist } from "../../repositories/bot";
import Queue from "../../libs/Queue";
import { CustomRequest } from "../../types";

export const verifyWebhook = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await userExist(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const bot = await botExist("companyId", user.companyId);
    if (!bot) {
      res.status(404).json({ error: "Bot not found" });
      return;
    }

    const facebookCredentials = bot.services?.facebook;

    if (!facebookCredentials) {
      res.status(404).json({ error: "Facebook credentials not found" });
      return;
    }

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === facebookCredentials.verifyToken) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  } catch (error: any) {
    next(error);
  }
};

export const eventsHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);

    if (req.body.object !== "page") {
      res.sendStatus(404);
    }

    const id = req.body.entry[0].id;
 
    Queue.add("MessengerService", { id, messages: req.body.entry });

    res.sendStatus(200);
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};