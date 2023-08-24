import { ExpressValidator } from "express-validator";
import * as CategoryService from "../category/category.services";

export const { body } = new ExpressValidator({
  isCategoryExist: async (category_id: string) => {
    try {
      const category = await CategoryService.getCategoryById(category_id);
      if (!category) {
        throw new Error(
          "Category with this id does not exist in the database."
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
});
