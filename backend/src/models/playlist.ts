import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Playlist = mongoose.model('Playlist', playlistSchema);
