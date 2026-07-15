import mongoose from "mongoose";

import { Investment } from "../models/investment.model.js";
import Startup from "../models/startup.model.js";
import InvestorProfile from "../models/investorProfile.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createInvestmentRequest = asyncHandler(async (req, res) => {
    const { startupId } = req.params;
    const {
        amount,
        equityAsked,
        message,
    } = req.body;

    if (!mongoose.isValidObjectId(startupId)) {
        throw new ApiError(
            400,
            "Invalid startup ID"
        );
    }

    const startup = await Startup.findById(startupId);

    if (!startup) {
        throw new ApiError(
            404,
            "Startup not found"
        );
    }

    if (startup.status !== "active") {
        throw new ApiError(
            400,
            "Only active startups can receive investments"
        );
    }

    if (!startup.openToInvestors) {
        throw new ApiError(
            400,
            "This startup is not accepting investments"
        );
    }

    if (
        startup.founder.toString() ===
        req.user._id.toString()
    ) {
        throw new ApiError(
            400,
            "You cannot invest in your own startup"
        );
    }

    const investorProfile =
        await InvestorProfile.findOne({
            user: req.user._id,
        });

    if (!investorProfile) {
        throw new ApiError(
            404,
            "Investor profile not found"
        );
    }

    const existingRequest =
        await Investment.findOne({
            startup: startupId,
            investor: req.user._id,
            status: {
                $in: [
                    "pending",
                    "accepted",
                ],
            },
        });

    if (existingRequest) {
        throw new ApiError(
            409,
            "You already have an active investment request for this startup"
        );
    }

    const investment =
        await Investment.create({
            startup: startupId,
            investor: req.user._id,
            amount,
            equityAsked,
            message,
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            investment,
            "Investment request sent successfully"
        )
    );
});

const getMyInvestments = asyncHandler(async (req, res) => {
    const investments = await Investment.find({
        investor: req.user._id,
    })
        .populate({
            path: "startup",
            populate: {
                path: "founder",
                select: "fullName username profilePicture",
            },
        })
        .sort({
            createdAt: -1,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                investmentCount: investments.length,
                investments,
            },
            "Investments fetched successfully"
        )
    );
});

const getStartupInvestmentRequests = asyncHandler(async (req, res) => {
    const { startupId } = req.params;

    if (!mongoose.isValidObjectId(startupId)) {
        throw new ApiError(
            400,
            "Invalid startup ID"
        );
    }

    const startup = await Startup.findById(startupId);

    if (!startup) {
        throw new ApiError(
            404,
            "Startup not found"
        );
    }

    if (
        startup.founder.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to view investment requests"
        );
    }

    const investments = await Investment.find({
        startup: startupId,
    })
        .populate(
            "investor",
            "fullName username profilePicture"
        )
        .sort({
            createdAt: -1,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                requestCount: investments.length,
                investments,
            },
            "Investment requests fetched successfully"
        )
    );
});

const updateInvestmentStatus = asyncHandler(async (req, res) => {
    const { investmentId } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(investmentId)) {
        throw new ApiError(
            400,
            "Invalid investment ID"
        );
    }

    const investment = await Investment.findById(investmentId)
        .populate("startup");

    if (!investment) {
        throw new ApiError(
            404,
            "Investment request not found"
        );
    }

    if (
        investment.startup.founder.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Only the startup founder can update this investment request"
        );
    }

    const allowedStatuses = [
        "accepted",
        "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
        throw new ApiError(
            400,
            "Invalid investment status"
        );
    }

    if (investment.status !== "pending") {
        throw new ApiError(
            400,
            "Only pending investment requests can be updated"
        );
    }

    investment.status = status;

    await investment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            investment,
            "Investment status updated successfully"
        )
    );
});

const withdrawInvestmentRequest = asyncHandler(async (req, res) => {
    const { investmentId } = req.params;

    if (!mongoose.isValidObjectId(investmentId)) {
        throw new ApiError(
            400,
            "Invalid investment ID"
        );
    }

    const investment = await Investment.findById(
        investmentId
    );

    if (!investment) {
        throw new ApiError(
            404,
            "Investment request not found"
        );
    }

    if (
        investment.investor.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to withdraw this investment request"
        );
    }

    if (investment.status !== "pending") {
        throw new ApiError(
            400,
            "Only pending investment requests can be withdrawn"
        );
    }

    investment.status = "withdrawn";

    await investment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            investment,
            "Investment request withdrawn successfully"
        )
    );
});
export {
    createInvestmentRequest,
    getMyInvestments,
    getStartupInvestmentRequests,
    updateInvestmentStatus,
    withdrawInvestmentRequest,
};