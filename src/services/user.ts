import { prisma } from "../utils/prisma.js";

type Props = {
    name: string;
    email: string;
    password: string;
};

export const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: { email },
    });

    if (user) {
        return user;
    }

    return null;
};

export const createUser = async (data: Props) => {
    const newUser = await prisma.user.create({ data });

    return newUser;
};
