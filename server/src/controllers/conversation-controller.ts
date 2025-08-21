import { Request, Response } from "express";
import {
  createConversationService,
  getUserConversationsService,
  updateConversationService,
} from "../services/conversation-service";
import { ExtendedRequest } from "../types/extended-request";

export const createConversation = async (
  req: ExtendedRequest,
  res: Response
) => {
  const user = req.user;
  const file = req.file as Express.Multer.File;
  const { conversation, message } = await createConversationService({
    ...req.body,
    user: user!.id,
    file,
  });

  return res.status(201).json({ conversation, message });
};

export const getUserConversations = async (
  req: ExtendedRequest,
  res: Response
) => {
  const user = req.user;
  const conversations = await getUserConversationsService(user!);
  return res.status(200).json(conversations);
};

export const updateConversation = async (
  req: ExtendedRequest,
  res: Response
) => {
  const conversationId = req.params.id;
  const conversation = await updateConversationService(
    conversationId,
    req.body
  );

  return res.status(200).json(conversation);
};
