import { Response, Request } from "express";
import * as CategoryService from "./category.services";
import { validationResult } from "express-validator";

/**
 * GET : Get lists of categories
 */
export const getListsOfCategories = async (
  request: Request,
  response: Response
) => {
  try {
    const categories = await CategoryService.getCategories();
    if (categories.length <= 0) {
      return response.status(400).json({
        error: { msg: "No category exist in the database." },
      });
    }
    return response.status(200).json(categories);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

/**
 * GET : Get single category by id
 * @param {string} id - id of the category
 */
export const getSingleCategory = async (
  request: Request,
  response: Response
) => {
  try {
    //Check if a category with this id existed in the database.
    const category = await CategoryService.getCategoryById(request.params.id);
    if (!category) {
      return response
        .status(400)
        .json({ error: { msg: "Category not found." } });
    }

    return response.status(200).json(category);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

/**
 * POST : Create a new category.
 * @param {string} name - name of a category
 * @param {string} created_by - id of creator
 * @param {string} updated_by - id of updater
 */
export const createNewCategory = async (
  request: Request,
  response: Response
) => {
  //Check if there is any error in validation of body data.
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  const { name, created_by, updated_by } = request.body;
  try {
    //Check if a category with this name existed in the database.
    const category = await CategoryService.getCategoryByName(
      name.toLowerCase()
    );
    if (category) {
      return response
        .status(400)
        .json({ error: { msg: "Category already exists in the database" } });
    }

    //Create a new category.
    const newCategory = await CategoryService.createCategory({
      name,
      created_by,
      updated_by,
    });
    return response.status(200).json(newCategory);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

/**
 * PUT : Update the category.
 * @path_variable {string} id : category_id of category
 * @param {string} name - name of a category
 * @param {string} updated_by - id of updater
 */
export const updateCategory = async (request: Request, response: Response) => {
  //Check if there is any error in validation of body data.
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  const { name, updated_by } = request.body;
  try {
    //Check if a category with this name existed in the database.
    let category = await CategoryService.getCategoryByName(
      name.toLowerCase(),
      request.params.id
    );
    if (category) {
      return response.status(400).json({
        error: {
          msg: "Category with this name already exists in the database.",
        },
      });
    }

    //Check if a category with this id existed in the database.
    category = await CategoryService.getCategoryById(request.params.id);
    if (!category) {
      return response.status(400).json({
        error: { msg: "Category with this id does not exist in the database." },
      });
    }

    //Update category.
    const updatedCategory = await CategoryService.updateCategory({
      name,
      updated_by,
      category_id: request.params.id,
    });
    return response.status(200).json(updatedCategory);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

/**
 * DELETE : Delete a category by id
 * @path_variable {string} id : category_id of category
 */
export const deleteCategory = async (request: Request, response: Response) => {
  try {
    //Check if a category with this id existed in the database.
    const category = await CategoryService.getCategoryById(request.params.id);
    if (!category) {
      return response.status(400).json({
        error: { msg: "Category with this id does not exist in the database." },
      });
    }

    //Delete category.
    const deletedCategory = await CategoryService.deleteCategory(
      request.params.id
    );
    return response.status(200).json(deletedCategory);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};
