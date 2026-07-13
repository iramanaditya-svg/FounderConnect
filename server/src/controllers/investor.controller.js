import InvestorProfile from "../models/investorProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createInvestorProfile = asyncHandler(async (req, res) => {
    const {
        preferredIndustries,
        preferredStages,
        bio,
        linkedin,
        website,
        portfolio,
    } = req.body;

    if (!bio?.trim()) {
        throw new ApiError(400, "Bio is required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.activeRole !== "investor") {
        throw new ApiError(
            403,
            "Switch to Investor role first"
        );
    }

    const existingProfile = await InvestorProfile.findOne({
        user: user._id,
    });

    if (existingProfile) {
        throw new ApiError(
            409,
            "Investor profile already exists"
        );
    }

    const investorProfile = await InvestorProfile.create({
        user: user._id,
        preferredIndustries,
        preferredStages,
        bio,
        linkedin,
        website,
        portfolio,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            investorProfile,
            "Investor profile created successfully"
        )
    );
});

export {
    createInvestorProfile,
    getInvestorProfile,
    updateInvestorProfile,
    deleteInvestorProfile,
};