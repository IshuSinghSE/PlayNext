import { Playlist } from '../models/playlist.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';

const getPlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const playlist = await Playlist.findOne({}).where({ _id: id });
    if (!playlist) {
        throw new ApiError(404, 'playlist not found');
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, 'playlist found'));
});

const getPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({});
    return res
        .status(200)
        .json(new ApiResponse(200, playlists, 'playlists found'));
});

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videos } = req.body;
    // Validate request
    if (!name) {
        throw new ApiError(400, 'playlist name is required');
    }
    // Create a playlist
    const playlist = await Playlist.create({
        name,
        description,
        videos,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, 'playlist created successfully'));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, videos } = req.body;
    // Validate request
    if (!name) {
        throw new ApiError(400, 'playlist name is required');
    }
    const playlist = await Playlist.findById(id);
    if (!playlist) {
        throw new ApiError(404, 'playlist not found');
    }
    playlist.name = name;
    playlist.description = description;
    playlist.videos = videos;

    const playlistDetail = await Playlist.findByIdAndUpdate(
        id,
        {
            $set: req.body,
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlistDetail,
                'playlist updated successfully'
            )
        );
});
const deletePlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);

    if (!playlist) {
        throw new ApiError(404, 'Video not found');
    }

    await Playlist.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'playlist deleted successfully'));
});

export {
    getPlaylist,
    getPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
};
