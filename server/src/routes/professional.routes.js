import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    createProfessionalProfile,
} from "../controllers/professional.controller.js";

const router = Router();

router
    .route("/profile")
    .post(verifyJWT, createProfessionalProfile);

export default router;