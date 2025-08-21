import { Router } from "express";
import {
  createMessage,
  getMessages,
  getResponseAndUpdateMessage,
} from "../controllers/message-controller";
import { upload } from "../utils/multer";
import { authenticate } from "../middlewares/authentication";

const router = Router();

router.route("/").post(authenticate, upload.single("file"), createMessage);
router.route("/conversation/:conversationId").get(authenticate, getMessages);
router.route("/response/:id").patch(getResponseAndUpdateMessage);

export default router;
