import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../utils/prisma.js";

type Props = {
    title: string;
    content?: string;
    imageUrl?: string;
    authorId: number;
};

export const createPost = async (data: Props) => {
    const { authorId, ...rest } = data;

    return await prisma.post.create({
        data: {
            ...rest,
            author: {
                connect: { id: authorId },
            },
        },
    });
};

export const updatePost = async (id: number, data: Prisma.PostUpdateInput) => {
    return await prisma.post.update({
        where: { id },
        data,
    });
};

export const deletePost = async (id: number) => {
    return await prisma.post.delete({
        where: { id },
    });
};

export const getPostById = async (id: number) => {
    return await prisma.post.findFirst({
        where: { id },
    });
};

export const getAllPosts = async () => {
    return await prisma.post.findMany({});
};
