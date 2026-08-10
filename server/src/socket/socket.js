import { Server } from "socket.io";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("joinConversation", (conversationId) => {
            socket.join(conversationId);
        });

        socket.on("sendMessage", async (data) => {
            try {
                const {
                    conversationId,
                    senderId,
                    receiverId,
                    content,
                } = data;

                if (
                    !conversationId ||
                    !senderId ||
                    !receiverId ||
                    !content?.trim()
                ) {
                    return;
                }

                const conversation =
                    await Conversation.findOne({
                        _id: conversationId,
                        participants: senderId,
                    });

                if (!conversation) {
                    return;
                }

                const message =
                    await Message.create({
                        conversation:
                            conversationId,
                        sender: senderId,
                        receiver: receiverId,
                        content: content.trim(),
                    });

                conversation.lastMessage =
                    message._id;

                await conversation.save();

                const populatedMessage =
                    await Message.findById(
                        message._id
                    ).populate(
                        "sender",
                        "fullName username profilePicture"
                    );

                io.to(conversationId).emit(
                    "newMessage",
                    populatedMessage
                );
            } catch (error) {
                console.error(
                    "Socket message error:",
                    error
                );
            }
        });

        socket.on("disconnect", () => {
            console.log(
                "User disconnected:",
                socket.id
            );
        });
    });

    return io;
};

export default initializeSocket;