import { Router } from "express";
import {
  createConversation,
  getUserConversations,
  updateConversation,
} from "../controllers/conversation-controller";
import { authenticate } from "../middlewares/authentication";
import { upload } from "../utils/multer";

const router = Router();

router
  .route("/")
  .post(authenticate, upload.single("file"), createConversation)
  .get(authenticate, getUserConversations);

router.route("/:id").patch(authenticate, updateConversation);
export default router;
