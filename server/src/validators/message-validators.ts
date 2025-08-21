import { body } from "express-validator";
import { handleValidationResult } from "./validation-check";

export const validateCreateMessage = () => [
  body("conversationId")
    .notEmpty()
    .withMessage("Conversation is required")
    .isMongoId()
    .withMessage("Invalid conversation id"),
  body("query").isString().notEmpty().withMessage("Query is required"),
  handleValidationResult,
];
