import express from "express";
import * as PostController from "./post.controller";
import { authenticateUserToken } from "../middleware/authenticate";
import { body } from "./post.validator";

const postRouter = express.Router();

//Get lists of published posts
postRouter.get("/", PostController.getListOfPublishedPost);

//Get Own Post
postRouter.get("/get/own", authenticateUserToken, PostController.getOwnPosts);

//Get single post by id
postRouter.get("/:id", PostController.getSinglePostById);

//Creat a new post
postRouter.post(
  "/",
  body("title", "Title Cannot be Empty.")
    .notEmpty()
    .isString()
    .withMessage("Title should be a string.")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Title should have at least 2 characters and should not exceed 100 characters."
    ),
  body("content", "Content cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Content should be a string.")
    .isLength({ min: 4, max: 600 })
    .withMessage(
      "Content should have at least 4 characters and should not exceed 600 characters."
    ),
  body("category_id", "Category cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Category Id should be a string.")
    .isCategoryExist(),
  authenticateUserToken,
  PostController.createNewPost
);

//Save post as draft
postRouter.post(
  "/save-as-draft",
  body("title", "Title Cannot be Empty.")
    .notEmpty()
    .isString()
    .withMessage("Title should be a string.")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Title should have at least 2 characters and should not exceed 100 characters."
    ),
  body("content", "Content cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Content should be a string.")
    .isLength({ min: 4, max: 600 })
    .withMessage(
      "Content should have at least 4 characters and should not exceed 600 characters."
    ),
  body("category_id", "Category cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Category Id should be a string.")
    .isCategoryExist(),
  authenticateUserToken,
  PostController.savePostAsDraft
);

//Edit post
postRouter.put(
  "/:id",
  body("title", "Title Cannot be Empty.")
    .notEmpty()
    .isString()
    .withMessage("Title should be a string.")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Title should have at least 2 characters and should not exceed 100 characters."
    ),
  body("content", "Content cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Content should be a string.")
    .isLength({ min: 4, max: 600 })
    .withMessage(
      "Content should have at least 4 characters and should not exceed 600 characters."
    ),
  body("category_id", "Category cannot be empty.")
    .notEmpty()
    .isString()
    .withMessage("Category Id should be a string.")
    .isCategoryExist(),
  authenticateUserToken,
  PostController.editPost
);

//Delete post
postRouter.delete("/:id", authenticateUserToken, PostController.deletePost);

//Report post
postRouter.put("/report/:id", authenticateUserToken, PostController.reportPost);

export default postRouter;
