import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    createInvestorProfile,
    getInvestorProfile,
    updateInvestorProfile,
    deleteInvestorProfile
} from "../controllers/investor.controller.js";

const router = Router();

router
    .route("/profile")
    .post(verifyJWT, createInvestorProfile)
    .get(verifyJWT, getInvestorProfile)
    .patch(verifyJWT, updateInvestorProfile)
    .delete(verifyJWT, deleteInvestorProfile);

export default router;