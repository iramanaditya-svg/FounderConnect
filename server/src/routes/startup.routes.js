import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import { createStartup } from "../controllers/startup.controller.js";

const router = Router();

router
    .route("/")
    .post(verifyJWT, createStartup);

    export default router;