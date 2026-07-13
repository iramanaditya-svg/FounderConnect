import ProfessionalProfile from "../models/professionalProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProfessionalProfile = asyncHandler(async (req, res) => {
    const {
        headline,
        skills,
        experience,
        education,
        resume,
        github,
        linkedin,
        portfolio,
    } = req.body;

    if (!headline?.trim()) {
        throw new ApiError(400, "Headline is required");
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

    const professionalProfile = await ProfessionalProfile.create({
        user: user._id,
        headline,
        currentRole,
        skills,
        experience,
        education,
        resume,
        github,
        linkedin,
        portfolio,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            professionalProfile,
            "Professional profile created successfully"
        )
    );
});

const getProfessionalProfile = asyncHandler(async (req, res) => {

    const professionalProfile =
        await ProfessionalProfile.findOne({
            user: req.user._id,
        });

    if (!professionalProfile) {
        throw new ApiError(
            404,
            "Professional profile not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            professionalProfile,
            "Professional profile fetched successfully"
        )
    );
});
export { createProfessionalProfile, getProfessionalProfile };