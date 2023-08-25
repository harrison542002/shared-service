import { PostStatus, Prisma } from "@prisma/client";
import { db } from "../utils";
import { v4 as uuidv4 } from "uuid";

export type Post = {
  post_id: string;
  title: string;
  content: string;
  status: PostStatus;
  reported_user_ids: JSON;
  category_id: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
};

export type NewPostPayload = {
  title: string;
  content: string;
  category_id: string;
  status: PostStatus;
};

export type ChangeablePost = {
  title: string;
  content: string;
  category_id: string;
  updated_by: string;
};

/**
 * Get lists of posts for public
 */
export const getPosts = (status?: PostStatus, created_by?: string) => {
  return db.post.findMany({
    where: {
      ...(status !== undefined && { status: status }), //If status is not undefined, add it in where condition.
      ...(created_by !== undefined && { created_by: created_by }), //If createdBy is not undefined, add it in where condition.
    },
  });
};

/**
 * Get single post by id
 * @param {string} id - post_id of a post
 */
export const getPostById = (id: string) => {
  return db.post.findUnique({
    where: {
      post_id: id,
    },
  });
};

/**
 * Create a new post
 */
export const createNewPost = (post: NewPostPayload, creator: string) => {
  const generatedUUID = uuidv4();
  return db.post.create({
    data: {
      ...post,
      post_id: generatedUUID,
      created_by: creator,
      updated_by: creator,
    },
  });
};

/**
 * Edit a post by id
 * @param {string} id - post_id of a post.
 * @param {ChangeablePost} post - a post payload sent from user.
 */
export const editPost = (post: ChangeablePost, id: string) => {
  return db.post.update({
    where: {
      post_id: id,
    },
    data: {
      ...post,
    },
  });
};

/**
 * Change the post status
 * @param {string} id - post_id of a post.
 * @param {PostStatus} status - status of a post
 * @param {string} updater_id - user_id of a updater
 */
export const changePostStatus = (
  status: PostStatus,
  id: string,
  updater_id: string,
  reportedUsersList?: Prisma.JsonArray
) => {
  return db.post.update({
    where: {
      post_id: id,
    },
    data: {
      status: status,
      updated_by: updater_id,
      ...(reportedUsersList !== undefined && {
        reported_user_ids: reportedUsersList,
      }), //If reported user list is not undefined, add it in where condition.
    },
  });
};

/**
 * Delete a post by id
 * Only the creator can delete his or her post except admin.
 * @param {string} id - post_id of a post.
 */
export const deletePost = (id: string) => {
  return db.post.delete({
    where: {
      post_id: id,
    },
  });
};
