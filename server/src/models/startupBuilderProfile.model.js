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
},
bio: {
    type: String,
    trim: true,
    maxlength: 1000,
},
},{
    timestamps: true,
});

export default mongoose.model("StartupBuilderProfile", startupBuilderProfileSchema);