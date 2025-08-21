import { appConfig } from "../config/config";
import { NotFoundError } from "../errors";
import { Message, MessageDoc } from "../models/message";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { txtToPdf, docxToPdf } from "../utils/convert-to-pdf";
import { MIMETYPES } from "../config/constants";

const ai = new GoogleGenAI({
  apiKey: appConfig.geminiApiKey,
});

export const createMessageService = async (
  query: string,
  conversationId: string,
  myFile?: Express.Multer.File | undefined
) => {
  let uploadedFile = null;

  if (myFile && myFile.path) {
    let filepath = myFile.path;
    if (myFile?.mimetype === MIMETYPES.docx) {
      filepath = await docxToPdf(filepath);
    } else if (myFile?.mimetype === MIMETYPES.txt) {
      filepath = await txtToPdf(filepath);
    }

    uploadedFile = await ai.files.upload({
      file: filepath,
      config: { mimeType: MIMETYPES.pdf },
    });
  }

  const message = await Message.create({
    conversationId,
    query,
    ...(uploadedFile &&
      myFile && {
        file: {
          uri: uploadedFile.uri,
          mimeType: MIMETYPES.pdf,
          filename: myFile.filename,
        },
      }),
  });

  return message;
};

export const getResponseAndUpdateMessageService = async (messageId: string) => {
  const messageExists = await Message.findById(messageId);
  if (!messageExists) {
    throw new NotFoundError("Message not found");
  }

  const prevMessages = await Message.find({
    conversationId: messageExists.conversationId,
  }).sort({
    createdAt: 1,
  });

  let contents = prevMessages.flatMap((msg: MessageDoc) => {
    if (msg.file && msg.file.uri) {
      return [
        createUserContent([
          createPartFromUri(msg.file.uri, msg.file.mimeType),
          msg.query,
        ]),
        ...(msg.response
          ? [{ role: "model", parts: [{ text: msg.response }] }]
          : []),
      ];
    } else {
      return [
        { role: "user", parts: [{ text: msg.query }] },
        ...(msg.response
          ? [{ role: "model", parts: [{ text: msg.response }] }]
          : []),
      ];
    }
  });

  if (messageExists.file && messageExists.file.uri) {
    contents.push(
      createUserContent([
        createPartFromUri(
          messageExists.file.uri as string,
          messageExists.file.mimeType as string
        ),
        messageExists.query,
      ])
    );
  } else {
    contents.push({ role: "user", parts: [{ text: messageExists.query }] });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      systemInstruction:
        "You will give response based on the recently uploaded file or previously uploaded files if any.",
    },
  });

  messageExists.response = response.text;
  await messageExists.save();

  return messageExists;
};

export const getMessagesService = async ({
  conversationId,
  page = 0,
  limit = 1000,
}: {
  conversationId: string;
  page: number;
  limit: number;
}) => {
  const skip = Number(page) * Number(limit);

  const messages = await Message.find({ conversationId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: 1 });

  return messages;
};
