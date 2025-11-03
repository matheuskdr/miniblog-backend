import { Router } from "express";
import * as pingController from "../controllers/ping.js";
import * as authController from "../controllers/auth.js";
import { verifyJWT } from "../utils/jwt.js";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyJWT, pingController.privatePing);

mainRouter.post("/api/auth/register", authController.register);
mainRouter.post("/api/auth/login", authController.login);

//mainRouter.get("/api/posts", );
//mainRouter.get("/api/posts/:id", );
//mainRouter.post("/api/posts", );
//mainRouter.put("/api/posts/:id", );
//mainRouter.delete("/api/posts/:id", );
