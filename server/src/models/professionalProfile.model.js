import mongoose, { Schema } from "mongoose";

const professionalProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        professionalGoal: {
            type: String,
            enum: ["founding_member", "hiring"],
            required: [true, "Professional goal is required"],
        },
        headline: {
            type: String,
            trim: true,
            required: [true, "Headline is required"],
            maxlength: 100,
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        experience: {
            type: String,
            trim: true,
        },
        education: [
            {
                institute: {
                    type: String,
                    trim: true,
                },
                degree: {
                    type: String,
                    trim: true,
                },
                fieldOfStudy: {
                    type: String,
                    trim: true,
                },
                startYear: Number,
                endYear: Number,
            },
        ],
        resume: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            trim: true,
            lowercase: true,
        },
        linkedin: {
            type: String,
            trim: true,
            lowercase: true,
        },
        portfolio: {
            type: String,
            trim: true,
            lowercase: true,
        },
        availability: {
            type: String,
            enum: [
                "full_time",
                "part_time",
                "internship",
                "freelance",
            ],
            default: "full_time",
        },
    },
    {
        timestamps: true,
    }
);

const ProfessionalProfile = mongoose.model(
    "ProfessionalProfile",
    professionalProfileSchema
);

export default ProfessionalProfile;