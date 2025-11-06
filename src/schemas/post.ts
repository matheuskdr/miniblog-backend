import z from "zod";

export const addPostSchema = z.object({
    title: z.string({ message: "Título é obrigatório" }),
    content: z.string({ message: "Conteudo é obrigatório" }),
    body: z.string({ message: "Conteudo é obrigatório" }),
    imageUrl: z.file({ message: "Imagem é obrigatório" }).optional(),
});

export const editPostSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    body: z.string().optional(),
    imageUrl: z.string().optional(),
});
