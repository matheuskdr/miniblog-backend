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
