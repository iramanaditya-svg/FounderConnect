import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";

import {
    createProfessionalProfile,
    getProfessionalProfile,
    updateProfessionalProfile,
    deleteProfessionalProfile,
} from "../controllers/professional.controller.js";

const router = Router();

router
    .route("/profile")
    .post(verifyJWT, createProfessionalProfile)
    .get(verifyJWT, getProfessionalProfile)
    .patch(verifyJWT, updateProfessionalProfile)
    .delete(verifyJWT, deleteProfessionalProfile);

export default router;