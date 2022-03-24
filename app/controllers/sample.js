"use strict";

import mongoose from "mongoose";
import { variable } from "../config/environment_variable";
import { logger } from "../config/logger";

import User from "../models/sample";
const env = process.env.NODE_ENV || "development";

/**
 * Get user details
 * @returns {object} user
 */
export function getUserDetail(req, res, next) {
  const token = req.token;
  const userId = mongoose.Types.ObjectId(req.userId);

  User.findOne({ _id: userId })
    .select("-password")
    .lean()
    .exec(function (err, user) {
      if (err) {
        logger.error(
          "Unable to get single user record in user_controller.js. Error: " +
            err
        );

        return res.status(500).json({
          errorCode: "ERR_INTERNAL_SERVER_ERROR",
          errorMessage: err.message,
        });
      }

      if (!user) {
        res.status(404).end();
      } else {
        user.password = undefined;

        res.status(200).json(user);
      }
    });
}
