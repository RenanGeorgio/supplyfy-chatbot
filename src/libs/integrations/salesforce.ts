import { NextFunction } from "express";
import { app } from "../../server";
import { CustomRequest } from "../../types/types";

app.post("/outbound_message", (req: CustomRequest, res: Response, next: NextFunction) => {
  const xml_data =
    req.body["soapenv:Envelope"]["soapenv:Body"][0].notifications[0]
      .Notification[0].sObject[0];

  // Get user name and Phone Number
  const user = {
    Name: xml_data["sf:FirstName"][0],
    Phone_number: xml_data["sf:Phone"][0],
  };

  //send WhatsApp message
  const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;

  const options = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: user.Phone_number,
    type: "template",
    template: {
      name: "welcome",
      language: { code: "en_US" },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: user.Name,
            },
          ],
        },
      ],
    },
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    body: options ? JSON.stringify(options) : null,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  // send a response back to Salesforce
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
      <Ack>true</Ack>
    </notificationsResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

  res.headers.append("Content-Type", "application/xml");
  return res.status(200).send(xml);
});

app.get("/webhook", (req: CustomRequest, res: Response, next: NextFunction) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFICATION_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.status(403);
    }
  }
});

app.post("/webhook", async (req: CustomRequest, res: Response, next: NextFunction) => {
  const body = req.body;

  if (body.entry[0].changes[0].value !== "messages") {
    // not from the messages webhook so dont process
    return res.status(400);
  }

  const msg_status = body.entry[0].changes[0].value.statuses[0].status;

  // create a record in Salesforce CRM
  const request_access = await fetch(
    `https://login.salesforce.com/services/oauth2/token`,
    {
      body: `grant_type=password&client_id=${process.env.SFDC_CONSUMER_KEY}&client_secret=${process.env.SFDC_CONSUMER_SECRET}&username=${process.env.SFDC_USERNAME}&password=${process.env.SFDC_PASSWORD}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": 300,
      },
      method: "POST",
    }
  )
    .then((res) => res.json())
    .then((data) => data.access_token);

  const access_token = await request_access;

  if (msg_status == "read") {
    fetch(`${config.domain}/services/data/v55.0/sobjects/Account/`, {
      body: {
        Name: "WhatsApp User",
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => res.status(200))
      .catch((err) => res.status(400));
  } else {
    res.status(400);
  }
});