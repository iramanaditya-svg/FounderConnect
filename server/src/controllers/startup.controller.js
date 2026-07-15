import Startup from "../models/startup.model.js";
import StartupBuilderProfile from "../models/startupBuilderProfile.model.js";
import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { JobApplication } from "../models/jobApplication.model.js";
import { Job } from "../models/job.model.js";
import { Investment } from "../models/investment.model.js";


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

const getMyStartups = asyncHandler(async (req, res) => {

    const startups = await Startup.find({
        founder: req.user._id,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                startupCount: startups.length,
                startups,
            },
            "Startups fetched successfully"
        )
    );
});

const getStartupById = asyncHandler(async (req, res) => {
    const { startupId } = req.params;

    if (!mongoose.isValidObjectId(startupId)) {
        throw new ApiError(
            400,
            "Invalid startup ID"
        );
    }

    const startup = await Startup.findById(startupId)
        .populate(
            "founder",
            "fullName username profilePicture"
        )
        .populate(
            "foundingMembers.user",
            "fullName username profilePicture"
        );

    if (!startup) {
        throw new ApiError(
            404,
            "Startup not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            startup,
            "Startup fetched successfully"
        )
    );
});

const updateStartup = asyncHandler(async (req, res) => {
    const { startupId } = req.params;

    if (!mongoose.isValidObjectId(startupId)) {
        throw new ApiError(
            400,
            "Invalid startup ID"
        );
    }

    const {
        name,
        tagline,
        description,
        industry,
        stage,
        website,
        location,
        logo,
        coverImage,
        pitchDeck,
        openToInvestors,
        currentValuation,
        fundingGoal,
        equityOffered,
        status,
    } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
        throw new ApiError(
            404,
            "Startup not found"
        );
    }

    if (startup.founder.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this startup"
        );
    }

    if (name !== undefined && !name.trim()) {
        throw new ApiError(
            400,
            "Startup name cannot be empty"
        );
    }

    if (description !== undefined && !description.trim()) {
        throw new ApiError(
            400,
            "Description cannot be empty"
        );
    }

    if (location !== undefined && !location.trim()) {
        throw new ApiError(
            400,
            "Location cannot be empty"
        );
    }

    if (status === "funded") {
        throw new ApiError(
            400,
            "Startup status cannot be updated to funded manually"
        );
    }

    if (name) {
        const existingStartup = await Startup.findOne({
            name: name.trim(),
            _id: {
                $ne: startupId,
            },
        });

        if (existingStartup) {
            throw new ApiError(
                409,
                "A startup with this name already exists"
            );
        }
    }

    startup.name =
        name ?? startup.name;

    startup.tagline =
        tagline ?? startup.tagline;

    startup.description =
        description ?? startup.description;

    startup.industry =
        industry ?? startup.industry;

    startup.stage =
        stage ?? startup.stage;

    startup.website =
        website?.toLowerCase() ??
        startup.website;

    startup.location =
        location ?? startup.location;

    startup.logo =
        logo ?? startup.logo;

    startup.coverImage =
        coverImage ?? startup.coverImage;

    startup.pitchDeck =
        pitchDeck ?? startup.pitchDeck;

    startup.openToInvestors =
        openToInvestors ??
        startup.openToInvestors;

    startup.currentValuation =
        currentValuation ??
        startup.currentValuation;

    startup.fundingGoal =
        fundingGoal ??
        startup.fundingGoal;

    startup.equityOffered =
        equityOffered ??
        startup.equityOffered;

    startup.status =
        status ?? startup.status;

    await startup.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            startup,
            "Startup updated successfully"
        )
    );
});

const deleteStartup = asyncHandler(async (req, res) => {
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

    if (startup.founder.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this startup"
        );
    }

    const jobIds = await Job.find({
        startup: startup._id,
    }).distinct("_id");

    const hasActiveApplications =
        await JobApplication.exists({
            job: {
                $in: jobIds,
            },
            status: {
                $in: [
                    "pending",
                    "shortlisted",
                ],
            },
        });

    if (hasActiveApplications) {
        throw new ApiError(
            400,
            "You cannot delete a startup with active job applications"
        );
    }

const hasActiveInvestmentRequests =
    await Investment.exists({
        startup: startup._id,
        status: {
            $in: [
                "pending",
                "accepted",
            ],
        },
    });

if (hasActiveInvestmentRequests) {
    throw new ApiError(
        400,
        "You cannot delete a startup with active investment requests"
    );
}

    // TODO:
    // Prevent deletion if the startup has active conversations.

    await startup.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Startup deleted successfully"
        )
    );
});

export {
    createStartup,
    getMyStartups,
    getStartupById,
    updateStartup,
    deleteStartup
};