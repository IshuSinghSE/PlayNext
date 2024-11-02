import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

interface IVideo extends Document {
    videoFile: string;
    thumbnail?: string;
    owner: mongoose.Types.ObjectId;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
}

const videoSchema = new Schema<IVideo>(
    {
        videoFile: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Video = mongoose.model<IVideo>('Video', videoSchema);
