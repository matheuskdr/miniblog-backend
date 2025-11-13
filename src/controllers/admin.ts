import type { Response } from "express";
import { addPostSchema, editPostSchema } from "../schemas/post.js";
import { hadleCover } from "../utils/cloudinary.js";
import { createPost, deletePost, updatePost } from "../services/post.js";
import type { ExtendedRequest } from "../types/extended-request.js";

export const addPost = async (req: ExtendedRequest, res: Response) => {
    const safeData = addPostSchema.safeParse(req.body);
    if (!safeData.success)
        return res.json({ error: safeData.error.flatten().fieldErrors });

    if (!req.userId)
        return res.status(401).json({ error: "Usuário não autenticado." });

    const file = req.file;
    if (!file)
        return res
            .status(400)
            .json({ error: "Nenhum arquivo enviado ou nao permitido" });

    const imageName = await hadleCover(file);
    if (!imageName) return res.json({ error: "Imagem não permitida/enviada" });

    const newPost = await createPost({
        authorId: req.userId,
        title: safeData.data.title,
        content: safeData.data.content,
        body: safeData.data.body,
        imageUrl: imageName,
    });

    return res.status(201).json({
        message: "Post criado com sucesso!",
        post: newPost,
    });
};

export const editPost = async (req: ExtendedRequest, res: Response) => {
    const safeData = editPostSchema.safeParse(req.body);
    if (!safeData.success)
        return res.json({ error: safeData.error.flatten().fieldErrors });

    if (!req.userId)
        return res.status(401).json({ error: "Usuário não autenticado." });

    let imageName: string | null | undefined = null;

    if (req.file) imageName = await hadleCover(req.file);

    if (imageName == null) imageName = undefined;
    const data = Object.fromEntries(
        Object.entries({
            title: safeData.data.title,
            content: safeData.data.content,
            body: safeData.data.body,
            imageUrl: imageName,
        }).filter(([_, value]) => value !== undefined)
    );

    if (!req.params.id) return res.json({ error: "Precisa enviar o id." });

    const id: number = parseInt(req.params.id);
    const updatedPost = await updatePost(id, data);
    res.json({
        post: {
            id: updatedPost.id,
            authorId: updatedPost.authorId,
            title: updatedPost.title,
            content: updatedPost.content,
            body: updatedPost.body,
            image: updatedPost.imageUrl,
        },
    });
};
export const removePost = (req: ExtendedRequest, res: Response) => {
    if (!req.params.id) return res.json({ error: "Precisa mandar o id." });
    const id = parseInt(req.params.id);

    deletePost(id);
    return res.json({ post: req.params.id });
};
