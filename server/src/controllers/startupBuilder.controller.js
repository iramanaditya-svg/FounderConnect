import StartupBuilderProfile from "../models/startupBuilderProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Startup from "../models/startup.model.js";

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

const getStartupBuilderProfile = asyncHandler(async (req, res) => {

    const startupBuilderProfile =
        await StartupBuilderProfile.findOne({
            user: req.user._id,
        });

    if (!startupBuilderProfile) {
        throw new ApiError(
            404,
            "Startup Builder profile not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            startupBuilderProfile,
            "Startup Builder profile fetched successfully"
        )
    );
});

const updateStartupBuilderProfile = asyncHandler(async (req, res) => {
    const {
        headline,
        experience,
        linkedin,
        website,
        location,
        bio,
    } = req.body;

    const startupBuilderProfile =
        await StartupBuilderProfile.findOne({
            user: req.user._id,
        });

    if (!startupBuilderProfile) {
        throw new ApiError(
            404,
            "Startup Builder profile not found"
        );
    }

    if (headline !== undefined && !headline.trim()) {
        throw new ApiError(
            400,
            "Headline cannot be empty"
        );
    }

    if (location !== undefined && !location.trim()) {
        throw new ApiError(
            400,
            "Location cannot be empty"
        );
    }

    if (bio !== undefined && !bio.trim()) {
        throw new ApiError(
            400,
            "Bio cannot be empty"
        );
    }

    startupBuilderProfile.headline =
        headline ?? startupBuilderProfile.headline;

    startupBuilderProfile.experience =
        experience ?? startupBuilderProfile.experience;

    startupBuilderProfile.linkedin =
        linkedin?.toLowerCase() ??
        startupBuilderProfile.linkedin;

    startupBuilderProfile.website =
        website?.toLowerCase() ??
        startupBuilderProfile.website;

    startupBuilderProfile.location =
        location ?? startupBuilderProfile.location;

    startupBuilderProfile.bio =
        bio ?? startupBuilderProfile.bio;

    await startupBuilderProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            startupBuilderProfile,
            "Startup Builder profile updated successfully"
        )
    );
});

const deleteStartupBuilderProfile = asyncHandler(async (req, res) => {
    const startupBuilderProfile =
        await StartupBuilderProfile.findOne({
            user: req.user._id,
        });

    if (!startupBuilderProfile) {
        throw new ApiError(
            404,
            "Startup Builder profile not found"
        );
    }

    const startupCount = await Startup.countDocuments({
        founder: req.user._id,
    });

    if (startupCount > 0) {
        throw new ApiError(
            400,
            "Delete all your startups before deleting your Startup Builder profile"
        );
    }

    await startupBuilderProfile.deleteOne();

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.roles = user.roles.filter(
        (role) => role !== "startup_builder"
    );

    user.activeRole = user.roles[0] ?? null;

    await user.save({
        validateBeforeSave: false,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                roles: user.roles,
                activeRole: user.activeRole,
            },
            "Startup Builder profile deleted successfully"
        )
    );
});
export {
    createStartupBuilderProfile,
    getStartupBuilderProfile,
    updateStartupBuilderProfile,
    deleteStartupBuilderProfile,
};