import { UserStatus, UserType } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { db } from "../utils/db.server";
import * as AuthentcationService from "../utils/authentication";

export type User = {
  user_id: string;
  user_name: string;
  email: string;
  password: string;
  bio: string;
  token: string;
  user_type: UserType;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
  updated_by: string;
};

export type ChangableUserType = {
  user_name: string;
  bio: string;
};

//Define a select format to ensure not to expose sensitive information.
const selectedUserFormat = {
  user_id: true,
  user_name: true,
  email: true,
  bio: true,
  user_type: true,
  status: true,
  created_at: true,
  updated_at: true,
  updated_by: true,
};

/**
 * Get users
 */
export const getUsers = () => {
  return db.user.findMany({
    select: selectedUserFormat,
  });
};

/**
 * Get single user
 * @param {string} id - user_id of a user.
 **/
export const getSingleUserById = (id: string) => {
  return db.user.findUnique({
    where: {
      user_id: id,
    },
    select: selectedUserFormat,
  });
};

/**
 * Get single user
 * @param {string} email - email of a user.
 **/
export const getUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: {
      email: email,
    },
    select: selectedUserFormat,
  });
};

/**
 * Create a new user
 * @param {Omit<User, "user_type" | "status" | "user_id" | "updated_by">} user - a user data payload by omitting user_type, status, user_id and updated_by
 **/
export const createUser = (
  user: Omit<User, "user_type" | "status" | "user_id" | "updated_by">
): Promise<Omit<User, "password" | "token"> | null> => {
  const generatedUUID = uuidv4();

  //Generate a JWT token using userid and username
  const token = AuthentcationService.generateAccessToken({
    user_id: generatedUUID,
  });

  return db.user.create({
    data: {
      ...user,
      user_id: generatedUUID,
      updated_by: generatedUUID,
      user_type: UserType.NORMAL,
      status: UserStatus.No_Verify,
      token,
    },
    select: selectedUserFormat,
  });
};

/**
 * Update user data
 * @param {string} id - user_id of a user.
 * @param {ChangableUserType} user - a user data payload by omitting user_type, status, user_id and updated_by
 */
export const updateUserData = (id: string, user: ChangableUserType) => {
  return db.user.update({
    where: {
      user_id: id,
    },
    data: {
      ...user,
    },
    select: selectedUserFormat,
  });
};

/**
 * Delete User by Id
 * @param {string} id - user_id of a user.
 **/
export const deleteUser = (id: string) => {
  return db.user.delete({
    where: {
      user_id: id,
    },
    select: selectedUserFormat,
  });
};
