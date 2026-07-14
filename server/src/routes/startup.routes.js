import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import { createStartup } from "../controllers/startup.controller.js";

const router = Router();

router
    .route("/")
    .post(verifyJWT, createStartup);

router
    .route("/my-startups")
    .get(verifyJWT, getMyStartups);

router
    .route("/:startupId")
    .get(verifyJWT, getStartupById)
    .patch(verifyJWT, updateStartup)
    .delete(verifyJWT, deleteStartup);

    export default router;