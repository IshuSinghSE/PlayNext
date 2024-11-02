import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
        },
        text: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        dislikes: {
            type: Number,
            default: 0,
        },
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
