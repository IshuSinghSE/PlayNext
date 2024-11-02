import { Comment } from '../models/comment.ts';
import { Video } from '../models/video.ts';
import { ApiError } from '../utils/ApiError.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';

const createComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!text) {
        throw new ApiError(400, 'text is required');
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, 'video not found');
    }

    const comment = await Comment.create({
        video: videoId,
        // owner: req.user._id,
        text,
    });

    if (!comment) {
        throw new ApiError(400, 'comment not created');
    }

    // video.comments.push(comment._id);

    return res
        .status(201)
        .json({ success: true, data: comment, message: 'comment created' });
});

const getComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId });

    if (!comments || comments.length === 0) {
        return res
            .status(200)
            .json({ success: true, data: [], message: 'No comments yet' });
    }

    return res
        .status(200)
        .json({ success: true, data: comments, message: 'comments found' });
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
        throw new ApiError(400, 'text is required');
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'comment not found');
    }

    comment.text = text;

    await Comment.findByIdAndUpdate(
        commentId,
        { $set: req.body },
        { new: true }
    );

    return res
        .status(200)
        .json({ success: true, data: comment, message: 'comment updated' });
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'comment not found');
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json({ success: true, data: {}, message: 'comment deleted' });
});

export { createComment, getComments, updateComment, deleteComment };
