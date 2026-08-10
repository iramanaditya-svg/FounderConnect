import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    getMyConversations,
    searchChatUsers,
    createConversation,
    getMessages,
} from "../controllers/conversation.controller.js";

const router =
    Router();

router.get(
    "/conversations",
    verifyJWT,
    getMyConversations
);

router.post(
    "/conversations",
    verifyJWT,
    createConversation
);

router.get(
    "/conversations/search",
    verifyJWT,
    searchChatUsers
);

router.get(
    "/conversations/:conversationId/messages",
    verifyJWT,
    getMessages
);

export default router;