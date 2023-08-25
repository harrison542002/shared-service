import express from "express";
import * as UserController from "./user.controller";
import { body } from "./user.controller";
import { authenticateAdminToken, authenticateUserToken } from "../middleware";
import { validateBodyData } from "../middleware";

const userRouter = express.Router();

/**
 * GET : Get users by "admin"
 */
userRouter.get("/", authenticateAdminToken, UserController.getUsers);

/**
 * GET : Get single user by id
 */
userRouter.get("/:id", authenticateUserToken, UserController.getUser);

/**
 * GET : Get single user by id by "admin"
 */
userRouter.get("/admin/:id", authenticateAdminToken, UserController.getUser);

/**
 * POST : Create a new user, only by "admin"
 */
userRouter.post(
  "/admin-create",
  authenticateAdminToken,
  body("email", "Email cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Email should be a string.")
    .isEmail()
    .withMessage("Email should be in correct format.")
    .isEmailInUse(),
  body("user_name", "Username cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Username should be a string.")
    .isLength({ min: 4, max: 45 })
    .withMessage(
      "Username should be minimum at 4 characters and maximimum at 45 characters."
    )
    .matches(/^[A-Za-z0-9 ]+$/) //no special characters
    .withMessage("Username should not consist of any special characters."),
  body("password", "Password cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Password should be a string."),
  body("bio", "Bio cannot be empty")
    .notEmpty()
    .isString()
    .withMessage("Bio should not be empty."),
  validateBodyData,
  UserController.createNewUser
);

/**
 * POST : User Sign-Up
 */
userRouter.post(
  "/user-signup",
  body("email", "Email cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Email should be a string.")
    .isEmail()
    .withMessage("Email should be in correct format.")
    .isEmailInUse(),
  body("user_name", "Username cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Username should be a string.")
    .isLength({ min: 4, max: 45 })
    .withMessage(
      "Username should be minimum at 4 characters and maximimum at 45 characters."
    )
    .matches(/^[A-Za-z0-9 ]+$/) //no special characters
    .withMessage("Username should not consist of any special characters."),
  body("password", "Password cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Password should be a string."),
  body("bio", "Bio cannot be empty")
    .notEmpty()
    .isString()
    .withMessage("Bio should not be empty."),
  validateBodyData,
  UserController.createNewUser
);

/**
 * POST : User Sign-In
 */
userRouter.post(
  "/user-sign-in",
  body("email", "Email cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Email should be a string.")
    .isEmail()
    .withMessage("Email should be in correct format."),
  body("password", "Password cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Password should be a string."),
  UserController.signInUser
);

/**
 * PUT : Update User Info
 */
userRouter.put(
  "/:id",
  authenticateUserToken,
  body("user_name", "Username cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Username should be a string.")
    .isLength({ min: 4, max: 45 })
    .withMessage(
      "Username should be minimum at 4 characters and maximimum at 45 characters."
    )
    .matches(/^[A-Za-z0-9 ]+$/) //no special characters
    .withMessage("Username should not consist of any special characters."),
  body("bio", "Bio cannot be empty")
    .notEmpty()
    .isString()
    .withMessage("Bio should not be empty."),
  validateBodyData,
  UserController.updateUserData
);

/**
 * DELETE :Delete user by id
 */
userRouter.delete("/:id", authenticateAdminToken, UserController.deleteUser);

/**
 * PUT : Verify user by admin
 */
userRouter.put(
  "/verify/:id",
  authenticateAdminToken,
  UserController.verifyUser
);

/**
 * PUT : Suspend user by admin
 */
userRouter.put(
  "/suspend/:id",
  authenticateAdminToken,
  UserController.suspendUser
);

/**
 * PUT : upgrade user by admin
 */
userRouter.put(
  "/upgrade/:id",
  authenticateAdminToken,
  UserController.upgradeUser
);
export default userRouter;
