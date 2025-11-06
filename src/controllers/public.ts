import type { Request, Response } from "express";
import { getAllPosts, getPostById } from "../services/post.js";

export const getPost = async (req: Request, res: Response) => {
    if (!req.params.id) return res.json({ error: "Precisa mandar o id." });
    const id = parseInt(req.params.id);

    const post = await getPostById(id);
    if (!post) return res.json({ error: "Post inexistente" });
    res.json({ post: post });
};

export const getPosts = async (req: Request, res: Response) => {
    const posts = await getAllPosts();
    if (!posts) return res.json({ error: "Post inexistente" });
    res.json({ post: posts });
};
