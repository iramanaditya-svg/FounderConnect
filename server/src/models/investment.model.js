import mongoose, { Schema } from "mongoose";

const investmentSchema = new Schema(
    {
        startup: {
            type: Schema.Types.ObjectId,
            ref: "Startup",
            required: true,
        },

        investor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: [true, "Investment amount is required"],
            min: 1,
        },

        equityAsked: {
            type: Number,
            required: [true, "Equity asked is required"],
            min: 0.01,
            max: 100,
        },

        message: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "withdrawn",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export const Investment = mongoose.model(
    "Investment",
    investmentSchema
);