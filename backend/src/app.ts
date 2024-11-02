import express from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';

// routes
import userRouter from './routes/user.ts';
import videoRouter from './routes/video.ts';
import subscriptionRouter from './routes/subscription.ts';
import playlistRouter from './routes/playlist.ts';
import commentRouter from './routes/comment.ts';

// initialize express
const app = express();

// configurations
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookiesParser());

// routes declaration
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'This is the home route of the API',
        routes: [
            {
                method: 'GET',
                path: '/api/v1',
                url: `${req.protocol}://${req.get('host')}/api/v1`,
            },
            {
                method: 'GET',
                path: '/api/v1/users',
                url: `${req.protocol}://${req.get('host')}/api/v1/users`,
            },
            {
                method: 'GET',
                path: '/api/v1/products',
                url: `${req.protocol}://${req.get('host')}/api/v1/videos`,
            },
            {
                method: 'GET',
                path: '/api/v1/orders',
                url: `${req.protocol}://${req.get('host')}/api/v1/orders`,
            },
        ],
    });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/comments', commentRouter);

export { app };
