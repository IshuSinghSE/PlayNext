import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from './ApiError.ts';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'playnext',
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        throw new ApiError(400,`Unable to upload the file!${error}` );
    }
};

const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new ApiError(400, `Unable to delete the file! ${error}`);
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
