import { NextFunction, Response } from "express";
import XHubSignature from "x-hub-signature";
import Receive from "./receive";
import { getUserProfile } from "../service";
import { receivedAuthentication, receivedDeliveryConfirmation, receivedMessageRead, receivedAccountLink } from "./instagramController/received";
import { 
  Consumer, 
  WebhookEventType, 
  WebhookEventBase, 
  CustomRequest, 
  Obj, 
  EntryProps, 
  WebhookMsgDeliveries, 
  WebhookMsgSee, 
  WebhookMsgAccLink,
  WebhookMsgOptions } from "../../../types";
import { handlePrivateReply } from "./instagramController";
import { ConsumerData } from "./consumer";

const appSecret = process.env.APP_SECRET != "" ? process.env.APP_SECRET : "secret";
const xhub = new XHubSignature("SHA256", appSecret);

let users: Consumer[] = []; // TO-DO: jogar isso para o Redis

export const messageHandler = async (
  req: CustomRequest, 
  res: Response,
  next: NextFunction
) => {
  // Calcula o valor da assinatura x-hub para comparar com o valor no request header
  const calcXHubSignature = xhub.sign(req?.rawBody).toLowerCase();

  if (req?.headers["x-hub-signature-256"] != calcXHubSignature) {
    res.status(401).send({ message: "Warning - request header X-Hub-Signature not present or invalid" });
  }

  try {
    const body: WebhookEventType = req.body;

    if (body?.object === "instagram") {
      res.status(200).send("EVENT_RECEIVED");

      body.entry.forEach(async function (entry: EntryProps) {
        if ("changes" in entry) { // Evento de mudança em pagina
          // @ts-ignore
          if (entry?.changes[0]?.field === "comments") {
            const values: Obj = entry.changes[0];

            if (values?.value) {
              const change = values.value;

              if (change) {
                console.log("Got a comments event");
                const commentId = change.comment_id;

                return handlePrivateReply("comment_id", change.id, commentId);
              }
            }
          }
        }

        if (!("messaging" in entry)) {
          res.sendStatus(400).send({ message: "No messaging field in entry" });
          return;
        }

        if (entry?.messaging != undefined) {
          entry?.messaging?.forEach(async function (webhookEvent: WebhookEventBase | any) {
            if (("message" in webhookEvent) && (webhookEvent?.message?.is_echo === true)) { // Discarta eventos que nao sao do interesse para a aplicacao
              res.status(400).send({ message: "Got an echo" });
            } else {
              if (webhookEvent?.option) {
                receivedAuthentication(webhookEvent as WebhookMsgOptions);
              } else if (webhookEvent?.delivery) {
                receivedDeliveryConfirmation(webhookEvent as WebhookMsgDeliveries);
              } else if (webhookEvent?.read) {
                receivedMessageRead(webhookEvent as WebhookMsgSee);
              } else if (webhookEvent?.account_linking) {
                receivedAccountLink(webhookEvent as WebhookMsgAccLink);
              } else {
                const senderIgsid: string | number = webhookEvent.sender.id;

                if (!(senderIgsid in users)) { // Primeira vez que interage com o usuario
                  const user = new ConsumerData({
                    igsid: senderIgsid,
                    name: undefined,
                    profilePic: undefined,
                  });

                  let userProfile = await getUserProfile(senderIgsid.toString());

                  if (userProfile) {
                    user.setProfile(userProfile.name, userProfile.profilePic);

                    if (typeof senderIgsid == 'string') {
                      users[parseInt(senderIgsid, 10)] = user;
                    } else {
                      users[senderIgsid] = user;
                    }
                  }
                }

                const receiveMessage = new Receive(users[senderIgsid as number], webhookEvent);

                return receiveMessage.handleMessage();
              }
            }
          });
        }
      });
    } else {
      res.status(404).send({ message: "Unrecognized POST to webhook" });
    }
  } catch (error: any) {
    next(error);
  }
};