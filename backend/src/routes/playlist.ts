import { Router } from 'express';
import {
    createPlaylist,
    deletePlaylist,
    getPlaylist,
    getPlaylists,
    updatePlaylist,
} from '../controllers/playlist.ts';

const router = Router();

// Get all playlists
router.route('/').get(getPlaylists);
router.route('/create').post(createPlaylist);
router.route('/:id').get(getPlaylist);
router.route('/delete/:id').delete(deletePlaylist);
router.route('/update/:id').patch(updatePlaylist);

export default router;
