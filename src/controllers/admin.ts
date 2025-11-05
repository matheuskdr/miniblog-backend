import type { Request, Response } from "express";
import { addPostSchema } from "../schemas/post.js";
import { hadleCover } from "../utils/cloudinary.js";
import { createPost } from "../services/post.js";
import type { ExtendedRequest } from "../types/extended-request.js";

export const addPost = async (req: ExtendedRequest, res: Response) => {
    const safeData = addPostSchema.safeParse(req.body);
    if (!safeData.success)
        return res.json({ error: safeData.error.flatten().fieldErrors });

    if (!req.userId)
        return res.status(401).json({ error: "Usuário não autenticado." });

    const file = req.file;
    if (!file)
        return res.status(400).json({ error: "Nenhum arquivo enviado." });

    const imageName = await hadleCover(file);
    if (!imageName) return res.json({ error: "Imagem não permitida/enviada" });

    const newPost = await createPost({
        authorId: req.userId,
        title: safeData.data.title,
        content: safeData.data.content,
        imageUrl: imageName,
    });

    return res.status(201).json({
        message: "Post criado com sucesso!",
        post: newPost,
    });
};
