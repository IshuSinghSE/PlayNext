/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.ts"
import { Subscription } from "../models/subscription.ts"
import {ApiError} from "../utils/ApiError.ts"
import {ApiResponse} from "../utils/ApiResponse.ts"
import {asyncHandler} from "../utils/asyncHandler.ts"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})
const getSubscribedList = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getSubscribedList
}