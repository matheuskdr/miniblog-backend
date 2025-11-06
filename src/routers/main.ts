import { Router } from "express";
import * as pingController from "../controllers/ping.js";
import * as authController from "../controllers/auth.js";
import * as adminController from "../controllers/admin.js";
import * as publicController from "../controllers/public.js";
import { verifyJWT } from "../utils/jwt.js";
import multer from "multer";

export const mainRouter = Router();
const upload = multer();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyJWT, pingController.privatePing);

mainRouter.post("/api/auth/register", authController.register);
mainRouter.post("/api/auth/login", authController.login);

mainRouter.get("/api/posts", publicController.getPosts);
mainRouter.get("/api/posts/:id", publicController.getPost);

mainRouter.post(
    "/api/posts",
    verifyJWT,
    upload.single("imageUrl"),
    adminController.addPost
);
mainRouter.put(
    "/api/posts/:id",
    verifyJWT,
    upload.single("imageUrl"),
    adminController.editPost
);
mainRouter.delete("/api/posts/:id", verifyJWT, adminController.removePost);
