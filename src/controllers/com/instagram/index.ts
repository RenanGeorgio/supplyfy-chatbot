import { Consumer } from "../../../types";
// Object to store known users.
var users = {};

export const messageHandler = async (req: CustomRequest, res: Response) => {
  try {
    // Calcula o valor da assinatura x-hub para comparar com o valor no request header
    const calcXHubSignature = xhub.sign(req.rawBody).toLowerCase();

    if (req.headers["x-hub-signature-256"] != calcXHubSignature) {
      res
        .status(401)
        .send({
          message:
            "Warning - request header X-Hub-Signature not present or invalid",
        });
    }

    const body = req.body;

    if (body.object === "instagram") {
      res.status(200).send("EVENT_RECEIVED");

      body.entry.forEach(async function (entry) {
        if ("changes" in entry) {
          // Evento de mudança em pagina
          let receiveMessage = new Receive();

          if (entry.changes[0].field === "comments") {
            let change = entry.changes[0].value;

            if (entry.changes[0].value) {
              console.log("Got a comments event");
            }

            return receiveMessage.handlePrivateReply("comment_id", change.id);
          }
        }

        if (!("messaging" in entry)) {
          res.sendStatus(400).send({ message: "No messaging field in entry" });
          return;
        }

        entry.messaging.forEach(async function (webhookEvent) {
          // Discarta eventos que nao sao do interesse para a aplicacao
          if (
            "message" in webhookEvent &&
            webhookEvent.message.is_echo === true
          ) {
            res.status(400).send({ message: "Got an echo" });
            return;
          }

          let senderIgsid = webhookEvent.sender.id;

          if (!(senderIgsid in users)) { // Primeira vez que interage com o usuario
            const user: Consumer = {
              igsid: senderIgsid,
              name: undefined,
              profilePic: undefined,
            };

            let userProfile = await GraphApi.getUserProfile(senderIgsid);

            if (userProfile) {
              user.name = userProfile.name;
              user.profilePic = userProfile.profilePic;

              users[senderIgsid] = user;
            }
          }

          let receiveMessage = new Receive(users[senderIgsid], webhookEvent);

          return receiveMessage.handleMessage();
        });
      });
    } else {
      res.status(404).send({ message: "Unrecognized POST to webhook" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
