import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

interface ISubscription extends Document {
    subscriber: mongoose.Types.ObjectId;
    channel: mongoose.Types.ObjectId;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

export const Subscription = mongoose.model<ISubscription>(
    'Subscription',
    subscriptionSchema
);
