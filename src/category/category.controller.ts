import { Response, Request } from "express";
import * as CategoryService from "./category.services";
import { validationResult } from "express-validator";

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

export const createNewCategory = async (
  request: Request,
  response: Response
) => {
  //Check if there is any error in validation of body data.
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  const { name } = request.body;

  //Fetch login_id from jwt payload to insert in create_by and upated_by fields.
  const admin_name = request.jwtPayload.name;
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
      created_by: admin_name,
      updated_by: admin_name,
    });
    return response.status(200).json(newCategory);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

export const updateCategory = async (request: Request, response: Response) => {
  //Check if there is any error in validation of body data.
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  const { name } = request.body;

  //Fetch name from JWT Payload, to update the update_by field.
  const admin_name = request.jwtPayload.name;

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
      updated_by: admin_name,
      category_id: request.params.id,
    });
    return response.status(200).json(updatedCategory);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

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
