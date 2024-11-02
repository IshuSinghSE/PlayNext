import { ApiError } from '../utils/ApiError.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.ts';
import { Request } from 'express';

interface CustomRequest extends Request {
    user?: typeof User.prototype;
}

export const verifyJWT = asyncHandler(async (req:CustomRequest, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');

        // console.log(token);
        if (!token) {
            throw new ApiError(401, 'Unauthorized request');
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as jwt.JwtPayload & { _id: string };

        const user = await User.findById(decodedToken._id).select(
            '-password -refreshToken'
        );

        if (!user) {
            throw new ApiError(401, 'Invalid Access Token');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(
            401,
            (error as Error)?.message || 'Invalid access token'
        );
    }
});
