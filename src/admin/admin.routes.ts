import express from "express";
import * as AdminController from "./admin.controller";
import { body } from "./admin.controller";
import { authenticateAdminToken } from "../middleware/authenticate";

const adminRouter = express.Router();

/**
 * GET: get lists of admin
 */
adminRouter.get("/", authenticateAdminToken, AdminController.getListOfAdmin);

/**
 * GET: get single admin
 */
adminRouter.get("/:id", authenticateAdminToken, AdminController.getSingleAdmin);

/**
 * POST : Create a new admin
 * @param @unique login_id,
 * @param @unique name,
 * @param password
 */
adminRouter.post(
  "/",
  authenticateAdminToken,
  body("login_id", "Login ID should not be empty.")
    .notEmpty()
    .isString()
    .withMessage("Login ID should be a String.")
    .isLength({ min: 8, max: 8 })
    .withMessage("Length of Login Id should be 8.")
    .matches(/^[A-Za-z0-9 ]+$/) //no special characters
    .withMessage("Name should not consist of any special characters.")
    .isLoginIdNotInUse(),
  body("name", "Name should not be empty.")
    .notEmpty()
    .isString()
    .withMessage("Name should be a String.")
    .isLength({ min: 4, max: 25 })
    .withMessage("Length of Name should be at minimum of 4 and maximum of 25.")
    .matches(/^[A-Za-z0-9 ]+$/) //no special characters
    .withMessage("Name should not consist of any special characters.")
    .isUsernameNotInUse(),
  body("password", "Password should not be empty.")
    .notEmpty()
    .isString()
    .withMessage("Password should be a String."),
  AdminController.createAnAdmin
);

/**
 * PATCH : update password of an admin
 * @param {string} password - password of an admin
 * @pathVariable {string} id - login_id of an admin
 */
adminRouter.put(
  "/:id",
  authenticateAdminToken,
  body("password")
    .notEmpty()
    .withMessage("Password should not be empty.")
    .isString()
    .withMessage("Password should be a String."),
  AdminController.updatePasswordOfAdmin
);

/**
 * DELETE : delete admin
 * @path_variable {string} id - login_id of an admin
 */
adminRouter.delete(
  "/:id",
  authenticateAdminToken,
  AdminController.deleteAnAdminById
);

export default adminRouter;
