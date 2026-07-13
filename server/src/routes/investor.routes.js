import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import { createInvestorProfile } from "../controllers/investor.controller.js";

const router = Router();

router
    .route("/profile")
    .post(verifyJWT, createInvestorProfile);

export default router;