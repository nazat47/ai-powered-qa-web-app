import { Router } from "express";
import { logout, signIn, signUp } from "../controllers/auth-controller";

const router = Router();

router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);
router.route("/logout").post(logout);

export default router;
