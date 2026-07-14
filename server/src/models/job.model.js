import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
    {
        startup: {
            type: Schema.Types.ObjectId,
            ref: "Startup",
            required: true,
        },

        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            maxlength: 100,
        },

        employmentType: {
            type: String,
            enum: [
                "full_time",
                "part_time",
                "internship",
                "contract",
            ],
            required: [true, "Employment type is required"],
        },

        workMode: {
            type: String,
            enum: [
                "remote",
                "hybrid",
                "on_site",
            ],
            required: [true, "Work mode is required"],
        },

        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
        },

        requirements: [
            {
                type: String,
                trim: true,
            },
        ],

        responsibilities: [
            {
                type: String,
                trim: true,
            },
        ],

        requiredSkills: [
            {
                type: String,
                trim: true,
            },
        ],

        experienceLevel: {
            type: String,
            enum: [
                "fresher",
                "0_2",
                "2_5",
                "5_plus",
            ],
            required: [true, "Experience level is required"],
        },

        minSalary: {
            type: Number,
            min: 0,
        },

        maxSalary: {
            type: Number,
            min: 0,
        },

        numberOfOpenings: {
            type: Number,
            default: 1,
            min: 1,
        },

        applicationDeadline: {
            type: Date,
        },

        status: {
            type: String,
            enum: [
                "open",
                "closed",
                "paused",
            ],
            default: "open",
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

jobSchema.pre("validate", function (next) {
    if (
        this.minSalary !== undefined &&
        this.maxSalary !== undefined &&
        this.minSalary > this.maxSalary
    ) {
        return next(
            new Error("Minimum salary cannot be greater than maximum salary")
        );
    }

    next();
});

export const Job = mongoose.model("Job", jobSchema);