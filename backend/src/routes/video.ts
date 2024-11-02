import { Router } from 'express';
import {
    createVideo,
    getVideos,
    getVideo,
    deleteVideo,
    updateVideo,
} from '../controllers/video.ts';
import { upload } from '../middlewares/multer.middleware.ts';

const router = Router();

router.route('/create').post(
    upload.fields([
        {
            name: 'videoFile',
            maxCount: 1,
        },
        {
            name: 'thumbnail',
            maxCount: 1,
        },
    ]),
    createVideo
);

router.route('/').get(getVideos);
router.route('/:id').get(getVideo);
// router.route('/create').post(createVideo);
router.route('/delete/:id').delete(deleteVideo);
router.route('/update/:id').patch(updateVideo);

export default router;
