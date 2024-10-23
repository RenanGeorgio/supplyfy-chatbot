import { createEmailTemplate } from "../../repositories/templates";
import type { CustomRequest } from "../../types";
import { Response } from "express";

export async function create(req: CustomRequest, res: Response) {
  const body = req.body;
  const template = await createEmailTemplate(body);
  res.status(201).send(template);
}
