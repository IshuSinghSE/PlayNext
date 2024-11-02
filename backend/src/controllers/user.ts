import { asyncHandler } from '../utils/asyncHandler.ts';
import { Request } from 'express';
import { User } from '../models/user.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import { uploadOnCloudinary } from '../utils/cloudinary.ts';

const generateAccessAndRefreshTokens = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user?.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            `Something went wrong while generating referesh and access token ${error}`
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validate data
    // check if user exists
    // check for images
    // upload them to media server
    // create user in database
    // remove password and refresh token field from response
    // check for user creation
    // generate jwt token !!
    // return res
    const { fullName, email, username, password } = req.body;

    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ''
        )
    ) {
        throw new ApiError(400, 'All fields are required!');
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, 'User with email or username already exists');
    }

    const avatarLocalPath = Array.isArray(req.files)
        ? undefined
        : req.files?.avatar
          ? req.files.avatar[0]?.path
          : undefined;
    const coverImageLocalPath =
        !Array.isArray(req.files) &&
        req.files?.coverImage &&
        req.files.coverImage.length > 0
            ? req.files.coverImage[0]?.path
            : undefined;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar local file is required');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage =
        coverImageLocalPath && (await uploadOnCloudinary(coverImageLocalPath));

    if (!avatar) {
        throw new ApiError(400, 'Avatar file is required');
    }

    const user = await User.create({
        fullName: fullName?.toLowerCase(),
        username: username?.toLowerCase(),
        email: email?.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : '',
    });

    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            'Something went wrong while registering the user'
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, 'User registered Successfully')
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, 'Either username or email is required');
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, 'User does not exist');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid user credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id as string
    );
    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged In Successfully'
            )
        );
});

interface CustomRequest extends Request {
    user?: {
        _id: string;
    };
}

const logoutUser = asyncHandler(async (req: CustomRequest, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged Out'));
});

export { registerUser, loginUser, logoutUser };
