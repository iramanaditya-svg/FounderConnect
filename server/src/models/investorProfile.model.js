import mongoose, { Schema } from "mongoose";

const investorProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        preferredIndustries: [
            {
                type: String,
                trim: true,
            },
        ],

        preferredStages: [
            {
                type: String,
                enum: [
                    "idea",
                    "mvp",
                    "pre_seed",
                    "seed",
                    "series_a",
                    "series_b",
                ],
            },
        ],

        bio: {
            type: String,
            required: [true, "Bio is required"],
            trim: true,
            maxlength: 1000,
        },

        linkedin: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },

        website: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },

        portfolio: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const InvestorProfile = mongoose.model(
    "InvestorProfile",
    investorProfileSchema
);

export default InvestorProfile;