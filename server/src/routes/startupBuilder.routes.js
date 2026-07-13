import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    createStartupBuilderProfile,
} from "../controllers/startupBuilder.controller.js";

const router = Router();

router
    .route("/profile")
    .post(verifyJWT, createStartupBuilderProfile);

export default router;