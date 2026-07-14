import mongoose from "mongoose";

import { Job } from "../models/job.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import ProfessionalProfile from "../models/professionalProfile.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


const applyForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    if (!mongoose.isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid job ID"
        );
    }

    const job = await Job.findById(jobId)
        .populate("startup");

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    if (job.status !== "open") {
        throw new ApiError(
            400,
            "This job is no longer accepting applications"
        );
    }

    if (
        job.applicationDeadline &&
        new Date(job.applicationDeadline) < new Date()
    ) {
        throw new ApiError(
            400,
            "Application deadline has passed"
        );
    }

    if (
        job.startup.founder.toString() ===
        req.user._id.toString()
    ) {
        throw new ApiError(
            400,
            "You cannot apply to your own startup"
        );
    }

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

    if (!professionalProfile.resume) {
        throw new ApiError(
            400,
            "Please upload your resume before applying"
        );
    }

    const existingApplication =
        await JobApplication.findOne({
            job: jobId,
            applicant: req.user._id,
        });

    if (existingApplication) {
        throw new ApiError(
            409,
            "You have already applied for this job"
        );
    }

    const application =
        await JobApplication.create({
            job: jobId,
            applicant: req.user._id,
            resume: professionalProfile.resume,
            coverLetter,
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            application,
            "Application submitted successfully"
        )
    );
});

const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await JobApplication.find({
        applicant: req.user._id,
    })
        .populate({
            path: "job",
            populate: {
                path: "startup",
                select: "name logo location",
            },
        })
        .sort({
            createdAt: -1,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                applicationCount: applications.length,
                applications,
            },
            "Applications fetched successfully"
        )
    );
});

const getJobApplicants = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid job ID"
        );
    }

    const job = await Job.findById(jobId)
        .populate("startup");

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    if (
        job.startup.founder.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to view applicants for this job"
        );
    }

    const applications =
        await JobApplication.find({
            job: jobId,
        })
            .populate(
                "applicant",
                "fullName username profilePicture"
            )
            .sort({
                createdAt: -1,
            });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                applicantCount: applications.length,
                applications,
            },
            "Applicants fetched successfully"
        )
    );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(applicationId)) {
        throw new ApiError(
            400,
            "Invalid application ID"
        );
    }

    const application = await JobApplication.findById(applicationId)
        .populate({
            path: "job",
            populate: {
                path: "startup",
            },
        });

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    if (
        application.job.startup.founder.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this application"
        );
    }

    const allowedStatuses = [
        "shortlisted",
        "accepted",
        "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
        throw new ApiError(
            400,
            "Invalid application status"
        );
    }

    const allowedTransitions = {
        pending: [
            "shortlisted",
            "rejected",
        ],
        shortlisted: [
            "accepted",
            "rejected",
        ],
        accepted: [],
        rejected: [],
    };

    if (
        !allowedTransitions[
            application.status
        ].includes(status)
    ) {
        throw new ApiError(
            400,
            "Invalid status transition"
        );
    }

    if (status === "accepted") {
        const acceptedCount =
            await JobApplication.countDocuments({
                job: application.job._id,
                status: "accepted",
            });

        if (
            acceptedCount >=
            application.job.numberOfOpenings
        ) {
            throw new ApiError(
                400,
                "No openings available"
            );
        }
    }

    application.status = status;

    await application.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            application,
            "Application status updated successfully"
        )
    );
});

const withdrawApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    if (!mongoose.isValidObjectId(applicationId)) {
        throw new ApiError(
            400,
            "Invalid application ID"
        );
    }

    const application =
        await JobApplication.findById(applicationId);

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    if (
        application.applicant.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to withdraw this application"
        );
    }

    if (
        application.status === "accepted" ||
        application.status === "rejected"
    ) {
        throw new ApiError(
            400,
            `Cannot withdraw a ${application.status} application`
        );
    }

    await application.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Application withdrawn successfully"
        )
    );
});
export default {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    withdrawApplication,
};