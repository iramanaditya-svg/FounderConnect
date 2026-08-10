import mongoose from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Startup from "../models/startup.model.js";
import { Job } from "../models/job.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { Investment } from "../models/investment.model.js";

const getMyConversations = asyncHandler(async (req, res) => {
    const conversations =
        await Conversation.find({
            participants: req.user._id,
        })
            .populate(
                "participants",
                "fullName username profilePicture activeRole"
            )
            .populate("lastMessage")
            .sort({
                updatedAt: -1,
            });

    return res.status(200).json(
        new ApiResponse(
            200,
            conversations,
            "Conversations fetched successfully"
        )
    );
});

const searchChatUsers = asyncHandler(async (req, res) => {
    const query =
        req.query.q?.trim();

    if (!query) {
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "No search query provided"
            )
        );
    }

    const user =
        await User.findById(
            req.user._id
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    if (
        user.activeRole ===
        "professional" ||
        user.activeRole ===
        "investor"
    ) {
        const startups =
            await Startup.find({
                name: {
                    $regex: query,
                    $options: "i",
                },
                status: "active",
            })
                .populate(
                    "founder",
                    "fullName username profilePicture"
                )
                .select(
                    "name tagline industry stage logo founder"
                )
                .limit(10);

        const results = [];

        for (const startup of startups) {

            let eligible = false;

            if (
                user.activeRole ===
                "professional"
            ) {
                const jobs =
                    await Job.find({
                        startup: startup._id,
                    }).select("_id");

                const jobIds =
                    jobs.map(
                        (job) => job._id
                    );

                if (jobIds.length > 0) {
                    const application =
                        await JobApplication.findOne(
                            {
                                job: {
                                    $in: jobIds,
                                },
                                applicant:
                                    req.user._id,
                                status: {
                                    $in: [
                                        "pending",
                                        "shortlisted",
                                        "accepted",
                                    ],
                                },
                            }
                        );

                    eligible =
                        Boolean(application);
                }
            }

            if (
                user.activeRole ===
                "investor"
            ) {
                const investment =
                    await Investment.findOne({
                        startup:
                            startup._id,
                        investor:
                            req.user._id,
                        status: {
                            $in: [
                                "pending",
                                "accepted",
                            ],
                        },
                    });

                eligible =
                    Boolean(investment);
            }

            if (eligible) {
                results.push({
                    type: "startup",
                    _id: startup._id,
                    name: startup.name,
                    tagline:
                        startup.tagline,
                    industry:
                        startup.industry,
                    stage:
                        startup.stage,
                    logo:
                        startup.logo,
                    founder:
                        startup.founder,
                });
            }
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                results,
                "Chat search results fetched successfully"
            )
        );
    }

    if (
        user.activeRole ===
        "startup_builder"
    ) {
        const professionals =
            await User.find({
                activeRole:
                    "professional",
                $or: [
                    {
                        fullName: {
                            $regex: query,
                            $options: "i",
                        },
                    },
                    {
                        username: {
                            $regex: query,
                            $options: "i",
                        },
                    },
                ],
            })
                .select(
                    "fullName username profilePicture activeRole"
                )
                .limit(10);

        const investors =
            await User.find({
                activeRole:
                    "investor",
                $or: [
                    {
                        fullName: {
                            $regex: query,
                            $options: "i",
                        },
                    },
                    {
                        username: {
                            $regex: query,
                            $options: "i",
                        },
                    },
                ],
            })
                .select(
                    "fullName username profilePicture activeRole"
                )
                .limit(10);

        const results = [];

        for (
            const professional of professionals
        ) {

            const jobs =
                await Job.find({
                    createdBy:
                        req.user._id,
                }).select("_id");

            const jobIds =
                jobs.map(
                    (job) => job._id
                );

            if (jobIds.length === 0) {
                continue;
            }

            const application =
                await JobApplication.findOne(
                    {
                        job: {
                            $in: jobIds,
                        },
                        applicant:
                            professional._id,
                        status: {
                            $in: [
                                "pending",
                                "shortlisted",
                                "accepted",
                            ],
                        },
                    }
                );

            if (application) {
                results.push({
                    type: "professional",
                    _id:
                        professional._id,
                    name:
                        professional.fullName,
                    username:
                        professional.username,
                    profilePicture:
                        professional.profilePicture,
                    activeRole:
                        professional.activeRole,
                });
            }
        }

        for (
            const investor of investors
        ) {

            const startups =
                await Startup.find({
                    founder:
                        req.user._id,
                }).select("_id");

            const startupIds =
                startups.map(
                    (startup) =>
                        startup._id
                );

            if (
                startupIds.length === 0
            ) {
                continue;
            }

            const investment =
                await Investment.findOne({
                    startup: {
                        $in: startupIds,
                    },
                    investor:
                        investor._id,
                    status: {
                        $in: [
                            "pending",
                            "accepted",
                        ],
                    },
                });

            if (investment) {
                results.push({
                    type: "investor",
                    _id:
                        investor._id,
                    name:
                        investor.fullName,
                    username:
                        investor.username,
                    profilePicture:
                        investor.profilePicture,
                    activeRole:
                        investor.activeRole,
                });
            }
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                results,
                "Chat search results fetched successfully"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            [],
            "No chat search results"
        )
    );
});

const createConversation = asyncHandler(async (req, res) => {
    const { userId } =
        req.body;

    if (!userId) {
        throw new ApiError(
            400,
            "User ID is required"
        );
    }

    if (
        !mongoose.isValidObjectId(
            userId
        )
    ) {
        throw new ApiError(
            400,
            "Invalid user ID"
        );
    }

    if (
        userId.toString() ===
        req.user._id.toString()
    ) {
        throw new ApiError(
            400,
            "You cannot start a conversation with yourself"
        );
    }

    const currentUser =
        await User.findById(
            req.user._id
        );

    const targetUser =
        await User.findById(
            userId
        );

    if (
        !currentUser ||
        !targetUser
    ) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    let allowed = false;

    if (
        currentUser.activeRole ===
            "professional" &&
        targetUser.activeRole ===
            "startup_builder"
    ) {
        const jobs =
            await Job.find({
                createdBy:
                    targetUser._id,
            }).select("_id");

        const jobIds =
            jobs.map(
                (job) => job._id
            );

        if (jobIds.length > 0) {
            const application =
                await JobApplication.findOne(
                    {
                        job: {
                            $in: jobIds,
                        },
                        applicant:
                            currentUser._id,
                        status: {
                            $in: [
                                "pending",
                                "shortlisted",
                                "accepted",
                            ],
                        },
                    }
                );

            allowed =
                Boolean(application);
        }
    }

    if (
        currentUser.activeRole ===
            "investor" &&
        targetUser.activeRole ===
            "startup_builder"
    ) {
        const startups =
            await Startup.find({
                founder:
                    targetUser._id,
            }).select("_id");

        const startupIds =
            startups.map(
                (startup) =>
                    startup._id
            );

        if (
            startupIds.length > 0
        ) {
            const investment =
                await Investment.findOne({
                    startup: {
                        $in: startupIds,
                    },
                    investor:
                        currentUser._id,
                    status: {
                        $in: [
                            "pending",
                            "accepted",
                        ],
                    },
                });

            allowed =
                Boolean(investment);
        }
    }

    if (
        currentUser.activeRole ===
            "startup_builder" &&
        targetUser.activeRole ===
            "professional"
    ) {
        const jobs =
            await Job.find({
                createdBy:
                    currentUser._id,
            }).select("_id");

        const jobIds =
            jobs.map(
                (job) => job._id
            );

        if (jobIds.length > 0) {
            const application =
                await JobApplication.findOne(
                    {
                        job: {
                            $in: jobIds,
                        },
                        applicant:
                            targetUser._id,
                        status: {
                            $in: [
                                "pending",
                                "shortlisted",
                                "accepted",
                            ],
                        },
                    }
                );

            allowed =
                Boolean(application);
        }
    }

    if (
        currentUser.activeRole ===
            "startup_builder" &&
        targetUser.activeRole ===
            "investor"
    ) {
        const startups =
            await Startup.find({
                founder:
                    currentUser._id,
            }).select("_id");

        const startupIds =
            startups.map(
                (startup) =>
                    startup._id
            );

        if (
            startupIds.length > 0
        ) {
            const investment =
                await Investment.findOne({
                    startup: {
                        $in: startupIds,
                    },
                    investor:
                        targetUser._id,
                    status: {
                        $in: [
                            "pending",
                            "accepted",
                        ],
                    },
                });

            allowed =
                Boolean(investment);
        }
    }

    if (!allowed) {
        throw new ApiError(
            403,
            "You are not allowed to start a conversation with this user"
        );
    }

    let conversation =
        await Conversation.findOne({
            participants: {
                $all: [
                    currentUser._id,
                    targetUser._id,
                ],
            },
        });

    if (!conversation) {
        conversation =
            await Conversation.create({
                participants: [
                    currentUser._id,
                    targetUser._id,
                ],
            });
    }

    await conversation.populate(
        "participants",
        "fullName username profilePicture activeRole"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            conversation,
            "Conversation ready"
        )
    );
});

const getMessages = asyncHandler(async (req, res) => {
    const {
        conversationId,
    } = req.params;

    const conversation =
        await Conversation.findOne({
            _id: conversationId,
            participants:
                req.user._id,
        });

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }

    const messages =
        await Message.find({
            conversation:
                conversationId,
        })
            .populate(
                "sender",
                "fullName username profilePicture"
            )
            .sort({
                createdAt: 1,
            });

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Messages fetched successfully"
        )
    );
});

export {
    getMyConversations,
    searchChatUsers,
    createConversation,
    getMessages,
};