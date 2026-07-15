import InvestorProfile from "../models/investorProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Investment } from "../models/investment.model.js";

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

const getInvestorProfile = asyncHandler(async (req, res) => {
    const investorProfile = await InvestorProfile.findOne({
        user: req.user._id,
    });

    if (!investorProfile) {
        throw new ApiError(
            404,
            "Investor profile not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            investorProfile,
            "Investor profile fetched successfully"
        )
    );
});

const updateInvestorProfile = asyncHandler(async (req, res) => {
    const {
        preferredIndustries,
        preferredStages,
        bio,
        linkedin,
        website,
        portfolio,
    } = req.body;

    const investorProfile = await InvestorProfile.findOne({
        user: req.user._id,
    });

    if (!investorProfile) {
        throw new ApiError(
            404,
            "Investor profile not found"
        );
    }

    if (bio !== undefined && !bio.trim()) {
        throw new ApiError(
            400,
            "Bio cannot be empty"
        );
    }

    investorProfile.preferredIndustries =
        preferredIndustries ??
        investorProfile.preferredIndustries;

    investorProfile.preferredStages =
        preferredStages ??
        investorProfile.preferredStages;

    investorProfile.bio =
        bio ?? investorProfile.bio;

    investorProfile.linkedin =
        linkedin?.toLowerCase() ??
        investorProfile.linkedin;

    investorProfile.website =
        website?.toLowerCase() ??
        investorProfile.website;

    investorProfile.portfolio =
        portfolio?.toLowerCase() ??
        investorProfile.portfolio;

    await investorProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            investorProfile,
            "Investor profile updated successfully"
        )
    );
});

const deleteInvestorProfile = asyncHandler(async (req, res) => {
    const investorProfile = await InvestorProfile.findOne({
        user: req.user._id,
    });

    if (!investorProfile) {
        throw new ApiError(
            404,
            "Investor profile not found"
        );
    }

const hasActiveInvestments =
    await Investment.exists({
        investor: req.user._id,
        status: {
            $in: [
                "pending",
                "accepted",
            ],
        },
    });

if (hasActiveInvestments) {
    throw new ApiError(
        400,
        "You cannot delete your Investor profile while you have active investment requests"
    );
}

    await investorProfile.deleteOne();

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.roles = user.roles.filter(
        (role) => role !== "investor"
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
            "Investor profile deleted successfully"
        )
    );
});

export {
    createInvestorProfile,
    getInvestorProfile,
    updateInvestorProfile,
    deleteInvestorProfile,
};