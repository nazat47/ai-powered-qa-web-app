import mongoose, { Schema } from "mongoose";

export interface ConversationAttrs {
  title: string;
}

export interface ConversationDoc extends mongoose.Document {
  title: string;
}

interface ConversationModel extends mongoose.Model<ConversationDoc> {
  build: (attrs: Partial<ConversationAttrs>) => ConversationDoc;
}

const conversationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.statics.build = (attrs: Partial<ConversationAttrs>) => {
  return new Conversation(attrs);
};

export const Conversation = mongoose.model<ConversationDoc, ConversationModel>(
  "Conversation",
  conversationSchema
);
