import { FilterQuery } from "mongoose";
import {
  Conversation,
  ConversationAttrs,
  ConversationDoc,
} from "../models/conversation";
import { UserPayload } from "../types/user-payload";
import { NotFoundError } from "../errors";
import { createMessageService } from "./message-service";
import { MessageDoc } from "../models/message";

export const createConversationService = async (
  data: Partial<ConversationAttrs> & {
    query: string;
    file: Express.Multer.File;
  }
): Promise<{ conversation: ConversationDoc; message: MessageDoc }> => {
  const conversation = Conversation.build({
    ...data,
    title: data.query.substring(0, 20),
  });
  await conversation.save();

  const message = await createMessageService(
    data.query,
    conversation._id as string,
    data.file
  );
  return { conversation, message };
};

export const getUserConversationsService = async (user: UserPayload) => {
  let matchConditions: FilterQuery<ConversationAttrs> = { user: user.id };

  const conversations = await Conversation.find(matchConditions).sort({
    lastMessageTime: -1,
  });
  return conversations;
};

export const updateConversationService = async (
  id: string,
  data: Partial<ConversationAttrs>
) => {
  const conversation = await Conversation.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  return conversation;
};

export const getConversation = (id: string) => {
  const conversation = Conversation.findById(id);
  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }
  return conversation;
};
