import mongoose, { Schema } from "mongoose";

type File = {
  uri: string;
  filename: string;
  mimeType: string;
};

export interface MessageAttrs {
  conversationId: mongoose.Types.ObjectId | string;
  query: string;
  response?: string;
  file?: File;
}

export interface MessageDoc extends mongoose.Document {
  conversationId: mongoose.Types.ObjectId;
  query: string;
  response?: string;
  file?: File;
}

interface MessageModel extends mongoose.Model<MessageDoc> {
  build: (attrs: MessageAttrs) => MessageDoc;
}

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
    query: {
      type: String,
    },
    file: {
      uri: {
        type: String,
      },
      filename: {
        type: String,
      },
      mimeType: {
        type: String,
      },
    },
    response: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversationId: 1 });

messageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs);
};

export const Message = mongoose.model<MessageDoc, MessageModel>(
  "Message",
  messageSchema
);
