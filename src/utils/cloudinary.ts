import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const hadleCover = async (file: Express.Multer.File) => {
    try {
        const uploadFromBuffer = (buffer: Buffer) =>
            new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "miniblog" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(buffer).pipe(uploadStream);
            });

        const result = await uploadFromBuffer(file.buffer);
        return result.secure_url as string;
    } catch (err) {
        return false;
    }
};
