import ProfessionalProfile from "../models/professionalProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProfessionalProfile = asyncHandler(async (req, res) => {
const {
    professionalGoal,
    headline,
    skills,
    experience,
    education,
    resume,
    github,
    linkedin,
    portfolio,
    availability,
} = req.body;

if (
    [professionalGoal, headline].some(
        (field) => !field || field.trim() === ""
    )
) {
    throw new ApiError(
        400,
        "Professional goal and headline are required"
    );
}

const user = await User.findById(req.user._id);

if (!user) {
    throw new ApiError(404, "User not found");
}

if (user.activeRole !== "professional") {
    throw new ApiError(
        403,
        "Switch to Professional role first"
    );
}

const existingProfile = await ProfessionalProfile.findOne({
    user: user._id,
});

if (existingProfile) {
    throw new ApiError(
        409,
        "Professional profile already exists"
    );
}

const allowedGoals = [
    "founding_member",
    "hiring",
];

if (!allowedGoals.includes(professionalGoal)) {
    throw new ApiError(
        400,
        "Invalid professional goal"
    );
}

const professionalProfile =
    await ProfessionalProfile.create({
        user: user._id,
        professionalGoal,
        headline,
        skills,
        experience,
        education,
        resume,
        github,
        linkedin,
        portfolio,
        availability,
    });

    if (!professionalProfile) {
    throw new ApiError(
        500,
        "Something went wrong while creating Professional profile"
    );
}
return res.status(201).json(
    new ApiResponse(
        201,
        professionalProfile,
        "Professional profile created successfully"
    )
);
});

export {
    createProfessionalProfile,
};