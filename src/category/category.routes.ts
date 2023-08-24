import express from "express";
import * as CategoryController from "./category.controller";
import { body } from "express-validator";
import { authenticateAdminToken } from "../middleware/authenticate";

const categoryRouter = express.Router();

categoryRouter.get("/", CategoryController.getListsOfCategories);
categoryRouter.get("/:id", CategoryController.getSingleCategory);
categoryRouter.post(
  "/",
  authenticateAdminToken,
  body("name", "Name cannot be empty")
    .notEmpty()
    .isString()
    .withMessage("Name should be a string.")
    .isLength({ min: 2, max: 45 })
    .withMessage(
      "Name should be minimum at 2 characters and maximimum at 45 characters."
    ),
  CategoryController.createNewCategory
);
categoryRouter.put(
  "/:id",
  authenticateAdminToken,
  body("name", "Name cannot be empty")
    .notEmpty()
    .isString()
    .withMessage("Name should be a string.")
    .isLength({ min: 2, max: 45 })
    .withMessage(
      "Name should be minimum at 2 characters and maximimum at 45 characters."
    ),
  CategoryController.updateCategory
);
categoryRouter.delete(
  "/:id",
  authenticateAdminToken,
  CategoryController.deleteCategory
);

export default categoryRouter;
