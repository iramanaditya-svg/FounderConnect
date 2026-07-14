import mongoose, { Schema } from "mongoose";

const jobApplicationSchema = new Schema(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        applicant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resume: {
            type: String,
            required: true,
            trim: true,
        },

        coverLetter: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "pending",
                "shortlisted",
                "rejected",
                "accepted",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

jobApplicationSchema.index(
    {
        job: 1,
        applicant: 1,
    },
    {
        unique: true,
    }
);

export const JobApplication = mongoose.model(
    "JobApplication",
    jobApplicationSchema
);