import { Request, Response, NextFunction } from "express";
import * as UserService from "../user/user.services";
import * as AdminService from "../admin/admin.services";
import { UserStatus } from "@prisma/client";

const jwt = require("jsonwebtoken");

/**
 * Authenticate "user" with JWT token from "Authorization" header with Bearer as a prefix.
 */
export const authenticateUserToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //Get JWT token from request header.
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return response.status(401).json({ error: { msg: "User Unauthorized!" } });

  //Verify token
  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    async (err: any, payload: any) => {
      if (err) {
        return response
          .status(403)
          .json({ error: { msg: "Incorrect Token." } });
      }

      request.jwtPayload = payload;
      const { user_id } = request.jwtPayload;

      if (!user_id) {
        return response
          .status(403)
          .json({ error: { msg: "Unauthorized User!" } });
      }

      //Check if the user_id attached in token is correct.
      const user = await UserService.getSingleUserById(user_id);
      if (!user) {
        return response
          .status(403)
          .json({ error: { msg: "User with this id does not exist." } });
      }

      next();
    }
  );
};

/**
 * Authenticate "admin" with JWT token from "Authorization" header with Bearer as a prefix.
 */
export const authenticateAdminToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //Get JWT token from request header.
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return response.status(401).json({ error: { msg: "Admin Unauthorized!" } });

  //Verify token
  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    async (err: any, payload: any) => {
      if (err) {
        return response
          .status(403)
          .json({ error: { msg: "Incorrect Token." } });
      }

      request.jwtPayload = payload;
      const { login_id } = request.jwtPayload;

      if (!login_id) {
        return response
          .status(403)
          .json({ error: { msg: "Unauthorized Admin!" } });
      }

      //Check if the login_id attached in token is correct for an admin.
      const admin = await AdminService.getSingleAdmin(login_id);
      if (!admin) {
        return response
          .status(403)
          .json({ error: { msg: "Admin with this id does not exist." } });
      }

      next();
    }
  );
};

/**
 * Authenticate "admin" with JWT token from "Authorization" header with Bearer as a prefix.
 */
export const checkWhetherUserIsVerified = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user_id = request.jwtPayload.user_id;
  const user = await UserService.getSingleUserById(user_id);

  //If user haven't verify, limit user for posting, updating the post.
  if (user.status === UserStatus.No_Verify) {
    return response.status(400).json({
      error: {
        msg: "Your Account haven't verified, please wait for admin to verify.",
      },
    });
  }

  //If user have been suspended, then notify user, the account have been suspended.
  if (user.status === UserStatus.Suspended) {
    return response.status(400).json({
      error: {
        msg: "Your Account haven been suspended by administration.",
      },
    });
  }

  next();
};
