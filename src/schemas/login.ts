import z from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "E-mail é obrigatório" }),
    password: z
        .string({ message: "Senha é obrigatória" })
        .min(4, "Senha precisa ter 4 ou mais caracteres"),
});
