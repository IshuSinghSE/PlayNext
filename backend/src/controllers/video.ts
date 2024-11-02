import { Video } from '../models/video.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from '../utils/cloudinary.ts';
import { getVideoDuration } from '../utils/mediaEdit.ts';


const createVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished, owner } = req.body;

    if (!req.files) {
        throw new ApiError(400, 'Video file is required');
    }

    if (!title || !description) {
        throw new ApiError(400, 'Title and description are required');
    }

    const videoLocalPath = Array.isArray(req.files)
        ? undefined
        : req.files?.videoFile
          ? req.files.videoFile[0]?.path
          : undefined;

    const thumbnailLocalPath = Array.isArray(req.files)
        ? undefined
        : req.files?.thumbnail
          ? req.files.thumbnail[0]?.path
          : undefined;

    // Check if video file is uploaded
    if (!videoLocalPath) {
        throw new ApiError(400, 'Video local file is required');
    }

    const duration = await getVideoDuration(videoLocalPath as string);

    const videoFile = await uploadOnCloudinary(videoLocalPath as string);

    if (!videoFile) {
        throw new ApiError(400, 'Video file is required');
    }

    // Check if thumbnail file is uploaded
    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'Thumbnail local file is required');
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail) {
        throw new ApiError(400, 'Thumbnail file is required');
    }

  

    const video = await Video.create({
        videoFile: videoFile?.url,
        thumbnail: thumbnail?.url,
        owner: owner,
        title,
        description,
        duration: duration, // Set duration from ffprobe
        isPublished,
    });

    if (!video) {
        throw new ApiError(
            500,
            'Something went wrong while creating the video'
        );
    }

    return res
        .status(201)
        .json(new ApiResponse(200, video, 'Video created successfully')); // Corrected success message
});

const updateVideo = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, 'Video ID is required');
    }

    const video = await Video.findById(id);

    if (!video) {
        throw new ApiError(404, 'Video not found');
    }

    if (!Array.isArray(req.files) && req.files?.videoFile) {
        const videoLocalPath = req.files.videoFile[0]?.path;
        if (videoLocalPath) {
            const videoFile = await uploadOnCloudinary(
                videoLocalPath as string
            );

            if (!videoFile) {
                throw new ApiError(400, 'Video file is required');
            }

            req.body.videoFile = videoFile.url;

            const duration = await getVideoDuration(videoLocalPath as string);
            req.body.duration = duration; // Set duration from ffprobe

            if (video.videoFile) {
                deleteFromCloudinary(video.videoFile as string); // Only delete if URL exists
            }
        }
    }

    if (!Array.isArray(req.files) && req.files?.thumbnail) {
        const thumbnailLocalPath = req.files.thumbnail[0]?.path;
        if (thumbnailLocalPath) {
            const thumbnailFile = await uploadOnCloudinary(
                thumbnailLocalPath as string
            );

            if (!thumbnailFile) {
                throw new ApiError(400, 'Thumbnail file is required');
            }

            req.body.thumbnail = thumbnailFile.url;
            if (video.thumbnail) {
                deleteFromCloudinary(video.thumbnail as string); // Only delete if URL exists
            }
        }
    }

    const videoDetails = await Video.findByIdAndUpdate(
        id,
        {
            $set: req.body,
        },
        { new: true }
    );

    if (!videoDetails) {
        throw new ApiError(500, 'Something went wrong while updating the video');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videoDetails, 'Video updated successfully'));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, 'Video ID is required');
    }

    const video = await Video.findById(id);

    if (!video) {
        throw new ApiError(404, 'Video not found');
    }

    await Video.findByIdAndDelete(id);

    if (video.videoFile) {
        deleteFromCloudinary(video.videoFile as string); // Only delete if URL exists
    }
    if (video.thumbnail) {
        deleteFromCloudinary(video.thumbnail as string); // Only delete if URL exists
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Video deleted successfully'));
});

const getVideos = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    let videos;
    if (userId) {
        videos = await Video.find({ owner: userId }).populate('owner', 'username fullName avatar coverImage');
    } else {
        videos = await Video.find({}).populate('owner', 'username fullName avatar coverImage');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, 'Videos retrieved successfully'));
});

const getVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Video ID is required');
    }

    const video = await Video.findById(id).populate('owner', 'username fullName avatar coverImage');

    if (!video) {
        throw new ApiError(404, 'Video not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, 'Video retrieved successfully'));
});

export { createVideo, updateVideo, deleteVideo, getVideos, getVideo };
