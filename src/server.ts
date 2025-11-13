import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { mainRouter } from "./routers/main.js";
import cookieParser from "cookie-parser";

dotenv.config();

const server = express();
server.use(helmet());
server.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
server.use(cookieParser());
server.use(urlencoded({ extended: true }));
server.use(express.json());

server.use(mainRouter);

server.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor rodando em ${process.env.BASE_URL}`);
});
