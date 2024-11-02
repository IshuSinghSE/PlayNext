import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from './config/db.ts';

// Initialize dotenv to load environment variables from .env file
dotenv.config({
    path: './.env',
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `🍁 Server is running on http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.log('🔴 Server has failed to listen', error);
    });
