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

const updateProfessionalProfile = asyncHandler(async (req, res) => {
    const {
        headline,
        skills,
        experience,
        education,
        location,
        bio,
        linkedin,
        portfolio,
        resume,
    } = req.body;

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

    professionalProfile.headline =
        headline ?? professionalProfile.headline;

    professionalProfile.skills =
        skills ?? professionalProfile.skills;

    professionalProfile.experience =
        experience ?? professionalProfile.experience;

    professionalProfile.education =
        education ?? professionalProfile.education;

    professionalProfile.location =
        location ?? professionalProfile.location;

    professionalProfile.bio =
        bio ?? professionalProfile.bio;

    professionalProfile.linkedin =
        linkedin?.toLowerCase() ??
        professionalProfile.linkedin;

    professionalProfile.portfolio =
        portfolio?.toLowerCase() ??
        professionalProfile.portfolio;

    professionalProfile.resume =
        resume ?? professionalProfile.resume;

    await professionalProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            professionalProfile,
            "Professional profile updated successfully"
        )
    );
});

const deleteProfessionalProfile = asyncHandler(async (req, res) => {
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

    // TODO:
    // Prevent deletion if the user has active job applications.

    await professionalProfile.deleteOne();

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.roles = user.roles.filter(
        (role) => role !== "professional"
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
            "Professional profile deleted successfully"
        )
    );
});
export { createProfessionalProfile, getProfessionalProfile, updateProfessionalProfile, deleteProfessionalProfile };