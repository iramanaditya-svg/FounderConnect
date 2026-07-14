import mongoose from "mongoose";

import { Job } from "../models/job.model.js";
import Startup from "../models/startup.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { JobApplication } from "../models/jobApplication.model.js";

const createJob = asyncHandler(async (req, res) => {
    const { startupId } = req.params;

    if (!mongoose.isValidObjectId(startupId)) {
        throw new ApiError(
            400,
            "Invalid startup ID"
        );
    }

    const {
        title,
        employmentType,
        workMode,
        location,
        description,
        requirements,
        responsibilities,
        requiredSkills,
        experienceLevel,
        minSalary,
        maxSalary,
        numberOfOpenings,
        applicationDeadline,
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
            "You are not authorized to create jobs for this startup"
        );
    }

    if (startup.status !== "active") {
        throw new ApiError(
            400,
            "Only active startups can create jobs"
        );
    }

    if (
        applicationDeadline &&
        new Date(applicationDeadline) <= new Date()
    ) {
        throw new ApiError(
            400,
            "Application deadline must be in the future"
        );
    }

    const job = await Job.create({
        startup: startup._id,
        title,
        employmentType,
        workMode,
        location,
        description,
        requirements,
        responsibilities,
        requiredSkills,
        experienceLevel,
        minSalary,
        maxSalary,
        numberOfOpenings,
        applicationDeadline,
        createdBy: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            job,
            "Job created successfully"
        )
    );
});

const getStartupJobs = asyncHandler(async (req, res) => {
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

    const jobs = await Job.find({
        startup: startupId,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobCount: jobs.length,
                jobs,
            },
            "Jobs fetched successfully"
        )
    );
});

const getJobById = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid job ID"
        );
    }

    const job = await Job.findById(jobId)
        .populate(
            "startup",
            "name logo location stage"
        )
        .populate(
            "createdBy",
            "fullName username profilePicture"
        );

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            job,
            "Job fetched successfully"
        )
    );
});

const updateJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid job ID"
        );
    }

    const {
        title,
        employmentType,
        workMode,
        location,
        description,
        requirements,
        responsibilities,
        requiredSkills,
        experienceLevel,
        minSalary,
        maxSalary,
        numberOfOpenings,
        applicationDeadline,
        status,
    } = req.body;

    const job = await Job.findById(jobId).populate("startup");

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    if (job.startup.founder.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this job"
        );
    }

    if (title !== undefined && !title.trim()) {
        throw new ApiError(
            400,
            "Job title cannot be empty"
        );
    }

    if (location !== undefined && !location.trim()) {
        throw new ApiError(
            400,
            "Location cannot be empty"
        );
    }

    if (description !== undefined && !description.trim()) {
        throw new ApiError(
            400,
            "Description cannot be empty"
        );
    }

    if (
        applicationDeadline &&
        new Date(applicationDeadline) <= new Date()
    ) {
        throw new ApiError(
            400,
            "Application deadline must be in the future"
        );
    }

    job.title = title ?? job.title;
    job.employmentType =
        employmentType ?? job.employmentType;
    job.workMode =
        workMode ?? job.workMode;
    job.location =
        location ?? job.location;
    job.description =
        description ?? job.description;
    job.requirements =
        requirements ?? job.requirements;
    job.responsibilities =
        responsibilities ?? job.responsibilities;
    job.requiredSkills =
        requiredSkills ?? job.requiredSkills;
    job.experienceLevel =
        experienceLevel ?? job.experienceLevel;
    job.minSalary =
        minSalary ?? job.minSalary;
    job.maxSalary =
        maxSalary ?? job.maxSalary;
    job.numberOfOpenings =
        numberOfOpenings ?? job.numberOfOpenings;
    job.applicationDeadline =
        applicationDeadline ?? job.applicationDeadline;
    job.status =
        status ?? job.status;

    await job.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            job,
            "Job updated successfully"
        )
    );
});

const deleteJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid job ID"
        );
    }

    const job = await Job.findById(jobId).populate("startup");

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    if (job.startup.founder.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this job"
        );
    }

    const hasActiveApplications =
        await JobApplication.exists({
            job: job._id,
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
            "You cannot delete a job with active applications"
        );
    }

    await job.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Job deleted successfully"
        )
    );
});
export {
    createJob,
    getStartupJobs,
    getJobById,
    updateJob,
    deleteJob,
};