import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import ProfessionalProfile from "../models/professionalProfile.model.js";
import StartupBuilderProfile from "../models/startupBuilderProfile.model.js";
import InvestorProfile from "../models/investorProfile.model.js";
import Startup from "../models/startup.model.js";
import { Job } from "../models/job.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { Investment } from "../models/investment.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const {
        fullName,
        username,
        email,
        password
    } = req.body;

    if (
        [fullName, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with email or username already exists"
        );
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password
    });

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
);

if (!createdUser) {
    throw new ApiError(
        500,
        "Something went wrong while registering the user"
    );
}

const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

const options = {
    httpOnly: true,
    secure: false,
};

return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            201,
            {
                user: createdUser,
                accessToken,
                refreshToken,
            },
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {

    const {
        email,
        username,
        password
    } = req.body;

    if (!(username || email)) {
        throw new ApiError(
            400,
            "username or email is required"
        );
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid password"
        );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged Out"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Refresh token is required"
        );
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(
            401,
            "Invalid refresh token"
        );
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refreshed successfully"
            )
        );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (currentPassword === newPassword) {
    throw new ApiError(
        400,
        "New password must be different from the current password"
    );
}
    if (newPassword !== confirmPassword) {
        throw new ApiError(
            400,
            "New password and confirm password do not match"
        );
    }
    const user = await User.findById(req.user._id);
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid current password"
        );
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, username, email } = req.body;
    if (!fullName && !username && !email) {
        throw new ApiError(
            400,
            "At least one field is required to update"
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName: fullName,
                username: username?.toLowerCase(),
                email: email?.toLowerCase()
            },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    if (username) {
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: {
                $ne: req.user._id,
            },
        });

        if (existingUser) {
            throw new ApiError(
                409,
                "Username is already taken"
            );
        }
    }

    if (email) {
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: {
                $ne: req.user._id,
            },
        });

        if (existingUser) {
            throw new ApiError(
                409,
                "Email is already registered"
            );
        }
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        )
    );
});



const selectRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!role) {
        throw new ApiError(400, "Role is required");
    }

    const allowedRoles = [
        "startup_builder",
        "professional",
        "investor",
    ];

    if (!allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid role selected");
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }


    if (!user.roles.includes(role)) {
        user.roles.push(role);
    }


    user.activeRole = role;

    await user.save();

    const updatedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Role selected successfully"
        )
    );
});

const updateProfilePicture = asyncHandler(
    async (req, res) => {
        const { profilePicture } = req.body;

        if (
            profilePicture !== "" &&
            !profilePicture?.startsWith("data:image/")
        ) {
            throw new ApiError(
                400,
                "Invalid profile picture"
            );
        }

        if (
            profilePicture &&
            profilePicture.length > 700000
        ) {
            throw new ApiError(
                400,
                "Profile picture is too large"
            );
        }

        const user =
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    $set: {
                        profilePicture:
                            profilePicture || "",
                    },
                },
                {
                    new: true,
                }
            ).select(
                "-password -refreshToken"
            );

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                user,
                "Profile picture updated successfully"
            )
        );
    }
);

const deleteAccount = asyncHandler(
    async (req, res) => {
        const userId = req.user._id;

        const startups =
            await Startup.find({
                founder: userId,
            }).select("_id");

        const startupIds =
            startups.map(
                (startup) => startup._id
            );

        const jobs = await Job.find({
            $or: [
                {
                    createdBy: userId,
                },
                {
                    startup: {
                        $in: startupIds,
                    },
                },
            ],
        }).select("_id");

        const jobIds =
            jobs.map(
                (job) => job._id
            );

        await JobApplication.deleteMany({
            $or: [
                {
                    applicant: userId,
                },
                {
                    job: {
                        $in: jobIds,
                    },
                },
            ],
        });

        await Job.deleteMany({
            _id: {
                $in: jobIds,
            },
        });

        await Investment.deleteMany({
            $or: [
                {
                    investor: userId,
                },
                {
                    startup: {
                        $in: startupIds,
                    },
                },
            ],
        });

        await Startup.updateMany(
            {
                foundingMembers: {
                    $elemMatch: {
                        user: userId,
                    },
                },
            },
            {
                $pull: {
                    foundingMembers: {
                        user: userId,
                    },
                },
            }
        );

        await Startup.deleteMany({
            _id: {
                $in: startupIds,
            },
        });

        const conversations =
            await Conversation.find({
                participants: userId,
            }).select("_id");

        const conversationIds =
            conversations.map(
                (conversation) =>
                    conversation._id
            );

        await Message.deleteMany({
            $or: [
                {
                    sender: userId,
                },
                {
                    receiver: userId,
                },
                {
                    conversation: {
                        $in: conversationIds,
                    },
                },
            ],
        });

        await Conversation.deleteMany({
            participants: userId,
        });

        await ProfessionalProfile.deleteOne({
            user: userId,
        });

        await StartupBuilderProfile.deleteOne({
            user: userId,
        });

        await InvestorProfile.deleteOne({
            user: userId,
        });

        await User.findByIdAndDelete(
            userId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Account deleted successfully"
            )
        );
    }
);

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    selectRole,
    updateProfilePicture,
    deleteAccount
};