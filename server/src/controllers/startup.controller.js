import Startup from "../models/startup.model.js";
import StartupBuilderProfile from "../models/startupBuilderProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createStartup = asyncHandler(async (req, res) => {
const {
    name,
    tagline,
    description,
    industry,
    stage,
    website,
    location,
} = req.body;

if (
    [name, description, stage, location].some(
        (field) => !field?.trim()
    )
) {
    throw new ApiError(
        400,
        "Name, description, stage and location are required"
    );
}

if (!industry || industry.length === 0) {
    throw new ApiError(
        400,
        "At least one industry is required"
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

const startupBuilderProfile =
    await StartupBuilderProfile.findOne({
        user: user._id,
    });

if (!startupBuilderProfile) {
    throw new ApiError(
        400,
        "Complete your Startup Builder profile first"
    );
}
const existingStartup = await Startup.findOne({
    founder: user._id,
    name: name.trim(),
});

if (existingStartup) {
    throw new ApiError(
        409,
        "Startup with this name already exists."
    );
}

const startup = await Startup.create({
    name,
    tagline,
    description,
    industry,
    stage,
    website,
    location,

    founder: user._id,

    foundingMembers: [
        {
            user: user._id,
            role: "founder",
            status: "accepted",
        },
    ],
});

if (!startup) {
    throw new ApiError(
        500,
        "Something went wrong while creating startup"
    );
}

return res.status(201).json(
    new ApiResponse(
        201,
        startup,
        "Startup created successfully"
    )
);

});

export {
    createStartup,
};