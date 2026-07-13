import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    createStartupBuilderProfile,
    getStartupBuilderProfile,
    updateStartupBuilderProfile,
    deleteStartupBuilderProfile,
} from "../controllers/startupBuilder.controller.js";

const router = Router();

router
    .route("/profile")
    .post(verifyJWT, createStartupBuilderProfile)
    .get(verifyJWT, getStartupBuilderProfile)
    .patch(verifyJWT, updateStartupBuilderProfile)
    .delete(verifyJWT, deleteStartupBuilderProfile);


export default router;