import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { findUserByEmail } from "../services/user.js";
import type { ExtendedRequest } from "../types/extended-request.js";

export const createJWT = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
};

export const verifyJWT = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const tokenFromCookie = req.cookies?.token;
        const authHeader = req.headers["authorization"];
        const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;

        const token = tokenFromCookie || tokenFromHeader;
        if (!token) {
            return res.status(401).json({ error: "Acesso negado" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        const user = await findUserByEmail(decoded.email as string);
        if (!user) {
            return res.status(401).json({ error: "Acesso negado" });
        }

        req.userId = user.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Acesso negado" });
    }
};
