import mongoose, { Schema } from "mongoose";

const startupBuilderProfileSchema = new Schema({
user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
},
headline: {
    type: String,
    trim: true,
    required: [true, "Headline is required"],
    maxlength: 100,
},
experience: {
    type: String,
    trim: true,
},
linkedin: {
    type: String,
    trim: true,
    lowercase: true,
},
website: {
    type: String,
    trim: true,
    lowercase: true,
},
location: {
    type: String,
    trim: true,
    required: [true, "Location is required"],
},
bio: {
    type: String,
    trim: true,
    required: [true, "Bio is required"],
    maxlength: 1000,
},
},{
    timestamps: true,
});

const StartupBuilderProfile = mongoose.model(
    "StartupBuilderProfile",
    startupBuilderProfileSchema
);

export default StartupBuilderProfile;