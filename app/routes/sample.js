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

router.get("/user/", [validateToken], userController.getUserDetail);

export default router;
