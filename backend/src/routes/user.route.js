import { response, Router } from "express";
import { registerUser,githubAccess, getCurrentUser, logoutUser } from "../controllers/user.controllers.js";

const router = Router();
router.route('/auth/github').get(githubAccess);

router.route('/auth/github/callback').get(registerUser);

router.route('/me').get(getCurrentUser);

router.route("/logout").get(logoutUser);

export default router;