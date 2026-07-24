import mongoose, { Schema } from "mongoose";

const professionalProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        headline: {
            type: String,
            required: [true, "Headline is required"],
            trim: true,
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
            default: "",
        },

        education: {
    college: {
        type: String,
        trim: true,
    },

    degree: {
        type: String,
        trim: true,
    },

    branch: {
        type: String,
        trim: true,
    },

    graduationYear: {
        type: Number,
    },
},

        resume: {
            type: String,
            default: "",
        },

        github: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },

        linkedin: {
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

const ProfessionalProfile = mongoose.model(
    "ProfessionalProfile",
    professionalProfileSchema
);

export default ProfessionalProfile;