import { Request, Response } from "express";
import {
  createMessageService,
  getMessagesService,
  getResponseAndUpdateMessageService,
} from "../services/message-service";
import { ExtendedRequest } from "../types/extended-request";

export const createMessage = async (req: Request, res: Response) => {
  const { query, conversationId } = req.body;
  const file = req.file as Express.Multer.File;

  const response = await createMessageService(query, conversationId, file);
  return res.status(201).json(response);
};

export const getResponseAndUpdateMessage = async (
  req: ExtendedRequest,
  res: Response
) => {
  const { id } = req.params;

  const response = await getResponseAndUpdateMessageService(id);
  return res.status(200).json(response);
};

export const getMessages = async (req: ExtendedRequest, res: Response) => {
  const { page, limit } = req.query;
  const { conversationId } = req.params;

  const messages = await getMessagesService({
    conversationId,
    page: Number(page),
    limit: Number(limit),
  });
  return res.status(200).json(messages);
};
