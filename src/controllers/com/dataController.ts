import { Request, Response } from "express";
import crypto  from "crypto";
import { ignaiApi } from "../../api";

// https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
// https://stackoverflow.com/questions/64912667/how-to-get-req-body-from-facebooks-data-deletion-url-call
function base64decode(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;

  if (pad) {
    if (pad === 1) {
      throw new Error('Invalid base64 string');
    }
    input += new Array(5 - pad).join('=');
  }

  return Buffer.from(input, 'base64').toString('utf8');
}

function parseSignedRequest(signedRequest) {
  const [encodedSig, payload] = signedRequest.split('.');
  
  const sig = base64decode(encodedSig);
  const data = JSON.parse(base64decode(payload));

  if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
    throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
  }

  const expected_sig = crypto.createHmac('sha256', process.env.APP_SECRET).update(payload).digest();

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected_sig))) {
    console.error('Bad Signed JSON signature!');
    return null;
  }

  return data;
}

export const disAllow = async (req: Request, res: Response) => {
  const { signed_request } = req.body;

  const data = parseSignedRequest(signed_request);

  if (!data) {
    return res.status(400).json({ error: 'Invalid signed request' });
  }

  const userId = data ? data.user_id : null;
  // Consultar usuario no banco de dados + obter workspace id apartir do mesmo

  const response = await ignaiApi(`/api/delete?workspaceId=${workspaceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ignaiBotToken}`
    }
  });
  // Remover do database (mongo)
  // Atualizar o user
  // Start data deletion
  const statusUrl = `${process.env.IGNAI_BOT}/${companyId}/delete?id=${code}`; // URL to track the deletion
  const confirmationCode = code; // Unique code for the deletion request... exemplo = abc123

  const responseData = {
    url: statusUrl,
    confirmation_code: confirmationCode,
  };

  res.json(responseData);
}