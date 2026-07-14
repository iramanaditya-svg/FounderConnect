import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    createJob,
    getStartupJobs,
    getJobById,
    updateJob,
    deleteJob,
} from "../controllers/job.controller.js";

const router = Router();

router
    .route("/startups/:startupId/jobs")
    .post(verifyJWT, createJob)
    .get(verifyJWT, getStartupJobs);

router
    .route("/jobs/:jobId")
    .get(verifyJWT, getJobById)
    .patch(verifyJWT, updateJob)
    .delete(verifyJWT, deleteJob);

export default router;