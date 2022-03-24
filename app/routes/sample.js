"use strict";

import * as express from "express";
import passport from "passport";

import { variable } from "../config/environment_variable";
import {
  validateToken,
  validateAdminToken,
  validateTokenOrSkip,
} from "../middlewares/validate_token";

import * as userController from "../controllers/user_controller";

const env = process.env.NODE_ENV || "development";
const router = express.Router();

// Routes require admin role
router.get("/user/all/", [validateAdminToken], userController.listUser);
router.put(
  "/user/:_userId/",
  [validateAdminToken],
  userController.updateUserDetail
);
router.delete(
  "/user/:_userId/",
  [validateAdminToken],
  userController.deleteUser
);

// Routes to perform all own tasks
router.get("/user/", [validateToken], userController.getUserDetail);
router.put("/user/", [validateToken], userController.updateUserDetail);
router.post("/user/avatar/", [validateToken], userController.changeAvatar);

// Routes to perform tasks involving another users
router.get(
  "/user/:_userName/",
  [validateTokenOrSkip],
  userController.getUserVideo
);
router.post(
  "/user/:_userName/subscribe/",
  [validateToken],
  userController.subscribeUserChannel
);

// Get user video list based on username will not require access token

export default router;
