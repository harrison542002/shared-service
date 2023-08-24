import express from "express";
import * as UserController from "./user.controller";
import { body } from "./user.controller";
import {
  authenticateAdminToken,
  authenticateUserToken,
} from "../middleware/authenticate";

const userRouter = express.Router();

/**
 * GET : Get users
 */
userRouter.get("/", authenticateAdminToken, UserController.getUsers);

/**
 * GET : Get single user by id
 */
userRouter.get("/:id", authenticateUserToken, UserController.getUser);
userRouter.get("/admin/:id", authenticateAdminToken, UserController.getUser);

/**
 * POST : Create a new user
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
  UserController.createNewUser
);

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
  UserController.createNewUser
);

/**
 * PUT : Update user info
 */
userRouter.put(
  "/:id",
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
  UserController.updateUserData
);

/**
 * DELETE :Delete user by id
 */
userRouter.delete("/:id", UserController.deleteUser);

export default userRouter;
