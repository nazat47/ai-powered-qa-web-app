import { Router } from "express";
import {
  createMessage,
  getMessages,
  getResponseAndUpdateMessage,
} from "../controllers/message-controller";
import { upload } from "../utils/multer";
import { authenticate } from "../middlewares/authentication";
import { validateCreateMessage } from "../validators/message-validators";

const router = Router();

router
  .route("/")
  .post(
    authenticate,
    upload.single("file"),
    validateCreateMessage(),
    createMessage
  );
router.route("/conversation/:conversationId").get(authenticate, getMessages);
router.route("/response/:id").patch(getResponseAndUpdateMessage);

export default router;
