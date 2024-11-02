import mongoose from 'mongoose';
// import { DB_NAME } from '../constants.ts';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.DATABASE_URL}`
        );
        console.log(
            `🟢 Connected to MongoDB database! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log('🔴 Failed to connect to the database', error);
        process.exit(1);
    }
};

export default connectDB;
