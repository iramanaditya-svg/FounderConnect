import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    createInvestmentRequest,
    getMyInvestments,
    getStartupInvestmentRequests,
    updateInvestmentStatus,
    withdrawInvestmentRequest,
} from "../controllers/investment.controller.js";

const router = Router();

router
    .route("/startups/:startupId/investments")
    .post(verifyJWT, createInvestmentRequest)
    .get(verifyJWT, getStartupInvestmentRequests);

router
    .route("/investments/my")
    .get(verifyJWT, getMyInvestments);

router
    .route("/investments/:investmentId/status")
    .patch(verifyJWT, updateInvestmentStatus);

router
    .route("/investments/:investmentId")
    .delete(verifyJWT, withdrawInvestmentRequest);

export default router;