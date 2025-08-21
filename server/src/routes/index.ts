import { Router } from "express";
import conversationRoutes from "./conversation-route";
import messageRoutes from "./message-route";
import authRoute from "./auth-route";

const router = Router();

const moduleRoutes = [
  {
    path: "/conversations",
    route: conversationRoutes,
  },
  {
    path: "/messages",
    route: messageRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
];

moduleRoutes.forEach((moduleRoute) =>
  router.use(moduleRoute.path, moduleRoute.route)
);

export default router;
