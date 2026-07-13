import mongoose, { Schema } from "mongoose";

const startupSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Startup name is required"],
            trim: true,
            maxlength: 100,
        },

        tagline: {
            type: String,
            trim: true,
            maxlength: 150,
            default: "",
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },

        industry: [
            {
                type: String,
                trim: true,
            },
        ],

        stage: {
            type: String,
            enum: [
                "idea",
                "mvp",
                "pre_seed",
                "seed",
                "series_a",
                "series_b",
            ],
            required: [true, "Startup stage is required"],
        },

        website: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },

        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },

        logo: {
            type: String,
            default: "",
        },

        coverImage: {
            type: String,
            default: "",
        },

        pitchDeck: {
            type: String,
            default: "",
        },

        founder: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        foundingMembers: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },

                role: {
                    type: String,
                    required: true,
                    trim: true,
                },

                status: {
                    type: String,
                    enum: ["pending", "accepted"],
                    default: "accepted",
                },

                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        openToInvestors: {
            type: Boolean,
            default: false,
        },

        currentValuation: {
            type: Number,
        },

        fundingGoal: {
            type: Number,
        },

        equityOffered: {
            type: Number,
            min: 0,
            max: 100,
        },

        status: {
            type: String,
            enum: [
                "draft",
                "active",
                "funded",
                "closed",
            ],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Startup = mongoose.model("Startup", startupSchema);

export default Startup;