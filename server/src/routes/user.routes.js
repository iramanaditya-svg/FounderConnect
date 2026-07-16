import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    selectRole,
} from "../controllers/user.controller.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);


router.route("/logout").post(
    verifyJWT,
    logoutUser
);

router.route("/change-password").post(
    verifyJWT,
    changeCurrentPassword
);

router.route("/current-user").get(
    verifyJWT,
    getCurrentUser
);

router.route("/update-account").patch(
    verifyJWT,
    updateAccountDetails
);

router.route("/select-role").post(
    verifyJWT,
    selectRole
);
export default router;