import { Request, Response } from "express";
import * as PostService from "./post.services";
import * as UserService from "../user/user.services";
import { PostStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

/**
 * GET : Get lists of published posts
 */
export const getListOfPublishedPost = async (
  request: Request,
  response: Response
) => {
  try {
    //Get list of published post.
    const posts = await PostService.getPosts(PostStatus.PUBLISHED);
    if (posts.length <= 0) {
      return response.status(400).json({
        error: { msg: "No Post exist in the database." },
      });
    }

    return response.status(200).json(posts);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * GET : Get single post by id
 */
export const getSinglePostById = async (
  request: Request,
  response: Response
) => {
  try {
    //Get single post.
    const post = await PostService.getPostById(request.params.id);
    if (!post) {
      return response
        .status(200)
        .json({ error: { msg: "There is no post with this id." } });
    }

    return response.status(200).json(post);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * POST : Create a new post
 */
export const createNewPost = async (request: Request, response: Response) => {
  const { user_id } = request.jwtPayload;

  try {
    //Get user input from request body.
    const { title, content, category_id } = request.body;

    //Create a new post
    const createdPost = await PostService.createNewPost(
      {
        title,
        content,
        category_id,
        status: PostStatus.PUBLISHED,
      },
      user_id
    );
    return response.status(200).json(createdPost);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * POST : Save post as draft
 */
export const savePostAsDraft = async (request: Request, response: Response) => {
  const { user_id } = request.jwtPayload;

  try {
    //Get user input from request body.
    const { title, content, category_id } = request.body;

    //Create a new post
    const createdPost = await PostService.createNewPost(
      {
        title,
        content,
        category_id,
        status: PostStatus.DRAFT,
      },
      user_id
    );
    return response.status(200).json(createdPost);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * PUT : Edit the existing post
 */
export const editPost = async (request: Request, response: Response) => {
  const { user_id } = request.jwtPayload;

  try {
    //Check if the post exist with current id
    const post = await PostService.getPostById(request.params.id);
    if (!post) {
      return response
        .status(403)
        .json({ error: { msg: "Post with this id does not exist." } });
    }

    //Check if the updater is actually the author of current post.
    if (post.created_by !== user_id) {
      return response.status(403).json({
        error: { msg: "Only the author of the post can edit the content." },
      });
    }

    const { title, content, category_id } = request.body;

    const editedPost = await PostService.editPost(
      { title, content, category_id, updated_by: user_id },
      request.params.id
    );
    return response.status(200).json(editedPost);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * DELETE : Delete the existing post
 */
export const deletePost = async (request: Request, response: Response) => {
  try {
    const { user_id, login_id } = request.jwtPayload;

    //Check if the post exist with current id
    const post = await PostService.getPostById(request.params.id);
    if (!post) {
      return response
        .status(403)
        .json({ error: { msg: "Post with this id does not exist." } });
    }

    if (user_id) {
      //check if the updater is actually the author of current post.
      if (post.created_by !== user_id) {
        return response.status(403).json({
          error: { msg: "Only the author of the post can delete the content." },
        });
      }
    } //else admin can delete the post.

    //Check if the post exist with current id
    const deletedPost = await PostService.deletePost(request.params.id);

    return response.status(200).json(deletedPost);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * Report the post
 */
export const reportPost = async (request: Request, response: Response) => {
  try {
    const { user_id } = request.jwtPayload;

    //Get JSON array of reported user
    const originalPost = await PostService.getPostById(request.params.id);

    //Get array of reported user id for this post
    let reportedUserLists = originalPost.reported_user_ids as Prisma.JsonArray;

    if (reportedUserLists === null) {
      //If the array is null create a new array with current reporter id
      reportedUserLists = [user_id] as Prisma.JsonArray;
    } else if (!reportedUserLists.includes(user_id)) {
      reportedUserLists = [...reportedUserLists, user_id] as Prisma.JsonArray;
    }

    //Change post status to report
    const reportedPost = await PostService.changePostStatus(
      PostStatus.REPORTED,
      request.params.id,
      user_id,
      reportedUserLists
    );
    return response.status(200).json(reportedPost);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * GET : Get own posts
 */
export const getOwnPosts = async (request: Request, response: Response) => {
  try {
    const { user_id } = request.jwtPayload;
    //Check if the user_id attached in token is correct.
    const user = await UserService.getSingleUserById(user_id);
    if (!user) {
      return response
        .status(403)
        .json({ error: { msg: "User with this id does not exist." } });
    }

    //Check if the post exist with current id
    const ownPosts = await PostService.getPosts(undefined, user_id);
    if (ownPosts.length <= 0) {
      return response.status(400).json({
        error: { msg: "You dont have any posts created in the database." },
      });
    }

    return response.status(200).json(ownPosts);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};
