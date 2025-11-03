import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/user.js";
import type { ExtendedRequest } from "../types/extended-request.js";

export const createJWT = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET as string);
};

export const verifyJWT = (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Acesso negado" });

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token ?? "",
        process.env.JWT_SECRET as string,
        async (error, decoded: any) => {
            if (error) return res.status(401).json({ error: "Acesso negado" });

            const user = await findUserByEmail(decoded.email);
            if (!user) return res.status(401).json({ error: "Acesso negado" });

            req.userEmail = user.email;
            next();
        }
    );
};
