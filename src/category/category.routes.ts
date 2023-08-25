import express from "express";
import * as CategoryController from "./category.controller";
import { body } from "express-validator";
import { authenticateAdminToken } from "../middleware";

const categoryRouter = express.Router();

/**
 * GET : Get lists of categories
 */
categoryRouter.get("/", CategoryController.getListsOfCategories);

/**
 * GET : Get single category by id
 * @param {string} id - id of the category
 */
categoryRouter.get("/:id", CategoryController.getSingleCategory);

/**
 * POST : Create a new category.
 * @param {string} name - name of a category
 */
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

/**
 * PUT : Update the category.
 * @path_variable {string} id : category_id of category
 * @param {string} name - name of a category
 */
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

/**
 * DELETE : Delete a category by id
 * @path_variable {string} id : category_id of category
 */
categoryRouter.delete(
  "/:id",
  authenticateAdminToken,
  CategoryController.deleteCategory
);

export default categoryRouter;
