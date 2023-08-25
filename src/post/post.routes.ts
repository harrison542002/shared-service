import express from "express";
import * as PostController from "./post.controller";
import {
  authenticateAdminToken,
  authenticateUserToken,
  checkWhetherUserIsVerified,
  validateBodyData,
} from "../middleware";
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
  authenticateUserToken,
  checkWhetherUserIsVerified,
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
  validateBodyData,
  PostController.createNewPost
);

//Save post as draft
postRouter.post(
  "/save-as-draft",
  authenticateUserToken,
  checkWhetherUserIsVerified,
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
  validateBodyData,
  PostController.savePostAsDraft
);

//Edit post
postRouter.put(
  "/:id",
  authenticateUserToken,
  checkWhetherUserIsVerified,
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
  validateBodyData,
  PostController.editPost
);

//Delete post
postRouter.delete("/:id", authenticateUserToken, PostController.deletePost);

//Delete post by admin
postRouter.delete(
  "/admin/:id",
  authenticateAdminToken,
  PostController.deletePost
);

//Report post
postRouter.put("/report/:id", authenticateUserToken, PostController.reportPost);

//Block post by admin
postRouter.put("/block/:id", authenticateAdminToken, PostController.blockPost);

//Publish post
postRouter.put(
  "/publish/:id",
  authenticateUserToken,
  PostController.publishPost
);

export default postRouter;
