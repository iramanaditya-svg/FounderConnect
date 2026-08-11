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
    updateProfilePicture,
    deleteAccount,
    getPublicProfile,
    searchProfiles
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

router.route("/search").get(
    searchProfiles
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
router.route("/profile/:username").get(
    getPublicProfile
);
router.route("/select-role").post(
    verifyJWT,
    selectRole
);
router.patch(
    "/profile-picture",
    verifyJWT,
    updateProfilePicture
);

router.delete(
    "/account",
    verifyJWT,
    deleteAccount
);
export default router;