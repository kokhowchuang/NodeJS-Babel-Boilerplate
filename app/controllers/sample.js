"use strict";

import path from "path";
import jwt from "jsonwebtoken";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import mongoose from "mongoose";
import { variable } from "../config/environment_variable";
import { logger } from "../config/logger";

import User from "../models/user";
import SubscribedUser from "../models/subscribed_user";
import * as PostController from "../controllers/post_controller";

const env = process.env.NODE_ENV || "development";
const jwtSecretKey = process.env.JWT_SECRET_KEY || variable[env].JWT.SECRETKEY;

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID || variable[env].S3.ACCESS_KEY_ID,
  secretAccessKey:
    process.env.S3_SECRET_ACCESS_KEY || variable[env].S3.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION || variable[env].S3.REGION,
});

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
