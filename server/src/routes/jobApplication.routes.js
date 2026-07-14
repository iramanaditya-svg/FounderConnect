import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    withdrawApplication,
} from "../controllers/jobApplication.controller.js";

const router = Router();

router
    .route("/jobs/:jobId/apply")
    .post(verifyJWT, applyForJob);

router
    .route("/applications/my")
    .get(verifyJWT, getMyApplications);

router
    .route("/jobs/:jobId/applicants")
    .get(verifyJWT, getJobApplicants);

router
    .route("/applications/:applicationId/status")
    .patch(verifyJWT, updateApplicationStatus);

router
    .route("/applications/:applicationId")
    .delete(verifyJWT, withdrawApplication);

export default router;