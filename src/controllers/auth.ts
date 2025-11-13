import type { RequestHandler } from "express";
import { registerSchema } from "../schemas/register.js";
import { createUser, findUserByEmail, findUserById } from "../services/user.js";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt.js";
import { loginSchema } from "../schemas/login.js";
import type { ExtendedRequest } from "../types/extended-request.js";

export const register: RequestHandler = async (req, res) => {
    const safeData = registerSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.json({ error: safeData.error.flatten().fieldErrors });
    }

    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
        return res.json({ error: "E-mail já existe" });
    }

    const hashPassword = await hash(safeData.data.password, 10);

    const newUser = await createUser({
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword,
    });

    const token = createJWT(newUser.email);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true em produção (https)
        sameSite: "lax",
        path: "/",
    });

    res.status(201).json({
        user: {
            name: newUser.name,
        },
    });
};

export const login: RequestHandler = async (req, res) => {
    const safeData = loginSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.json({ error: safeData.error.flatten().fieldErrors });
    }

    const user = await findUserByEmail(safeData.data.email);
    if (!user) return res.status(401).json({ error: "Acesso negado" });

    const verifyPass = await compare(safeData.data.password, user.password);
    if (!verifyPass) return res.status(401).json({ error: "Acesso negado" });

    const token = createJWT(safeData.data.email);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // mude para true em produção (https)
        sameSite: "lax",
        path: "/",
    });

    res.json({
        user: {
            name: user.name,
            email: user.email,
        },
    });
};

export const me: RequestHandler = async (req, res) => {
    const extendedReq = req as ExtendedRequest;
    if (!extendedReq.userId)
        return res.status(400).json({ error: "Precisa mandar ID" });

    const user = await findUserById(extendedReq.userId);
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json({ user });
};

export const logout: RequestHandler = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout realizado" });
};
