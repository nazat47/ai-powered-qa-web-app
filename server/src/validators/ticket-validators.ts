import { body } from "express-validator";
import { handleValidationResult } from "./validation-check";

export const validateCreateTicket = () => [
  body("customerId").notEmpty().withMessage("Missing customerId"),
  handleValidationResult,
];
