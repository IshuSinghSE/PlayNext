import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.ts';
import { upload } from '../middlewares/multer.middleware.ts';

const router = Router();

// Define your routes here
router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1,
        },
        {
            name: 'coverImage',
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

export default router;
