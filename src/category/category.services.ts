import { v4 as uuidv4 } from "uuid";
import { db } from "../utils/db.server";

type Category = {
  name: string;
  created_by: string;
  category_id?: string;
  updated_by: string;
};

//Get list of categories
export const getCategories = () => {
  return db.category.findMany();
};

//Get a single category by id
export const getCategoryById = (id: string) => {
  return db.category.findUnique({
    where: {
      category_id: id,
    },
  });
};

//Get a single category by name
export const getCategoryByName = (
  name: string,
  category_id?: string | null
) => {
  return db.category.findUnique({
    where: {
      name: name,
      category_id,
    },
    select: {
      name: true,
    },
  });
};

//Create a category
export const createCategory = (category: Category) => {
  return db.category.create({
    data: {
      ...category,
      name: category.name.toLowerCase(),
      category_id: uuidv4(),
    },
  });
};

//Update a category
export const updateCategory = (category: Omit<Category, "created_by">) => {
  const { updated_by, name } = category;
  return db.category.update({
    where: {
      category_id: category.category_id,
    },
    data: {
      updated_by,
      name: name.toLowerCase(),
    },
  });
};

//Delete a category
export const deleteCategory = (id: string) => {
  return db.category.delete({
    where: {
      category_id: id,
    },
  });
};
