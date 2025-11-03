import type { RequestHandler } from "express";
import { registerSchema } from "../schemas/register.js";
import { createUser, findUserByEmail } from "../services/user.js";
import { compare, hash } from "bcrypt-ts";
import { email } from "zod";
import { createJWT } from "../utils/jwt.js";
import { loginSchema } from "../schemas/login.js";

export const register: RequestHandler = async (req, res) => {
    // Validar os dados Recebidos
    const safeData = registerSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.json({ error: safeData.error.flatten().fieldErrors });
    }
    // Verificar email
    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
        return res.json({ error: "E-mail já existe" });
    }

    // Gerar hash de senha
    const hashPassword = await hash(safeData.data.password, 10);
    // Cria o usuario
    const newUser = await createUser({
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword,
    });
    // Cria o token
    const token = createJWT(newUser.email);
    // retorna o resultado (token, user)
    res.status(201).json({
        token,
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
    res.json({
        token,
        user: {
            name: user.name,
            email: user.email,
        },
    });
};
