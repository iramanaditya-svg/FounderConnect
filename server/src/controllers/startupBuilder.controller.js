import StartupBuilderProfile from "../models/startupBuilderProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createStartupBuilderProfile = asyncHandler(async (req, res) => {
    const {
        headline,
        experience,
        linkedin,
        website,
        location,
        bio,
    } = req.body;

    if (
        [headline, location, bio].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(
            400,
            "Headline, location and bio are required"
        );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.activeRole !== "startup_builder") {
        throw new ApiError(
            403,
            "Switch to Startup Builder role first"
        );
    }

    const existingProfile =
        await StartupBuilderProfile.findOne({
            user: user._id,
        });

    if (existingProfile) {
        throw new ApiError(
            409,
            "Startup Builder profile already exists"
        );
    }

    const startupBuilderProfile =
        await StartupBuilderProfile.create({
            user: user._id,
            headline,
            experience,
            linkedin,
            website,
            location,
            bio,
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            startupBuilderProfile,
            "Startup Builder profile created successfully"
        )
    );
});

export {
    createStartupBuilderProfile,
};