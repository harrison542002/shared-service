import { Request, Response } from "express";
import * as UserService from "./user.services";
import { User, ChangableUserType } from "./user.services";
import * as argon2 from "argon2";
import { ExpressValidator, validationResult } from "express-validator";

export const { body } = new ExpressValidator({
  isEmailInUse: async (email: string) => {
    try {
      const user = await UserService.getUserByEmail(email);
      if (user) {
        throw new Error("This email already has an account in the database.");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

/**
 * GET : Get list of users
 */
export const getUsers = async (request: Request, response: Response) => {
  try {
    const users = await UserService.getUsers();
    if (users.length <= 0) {
      return response.status(400).json({
        error: { msg: "No user exist in the database." },
      });
    }
    return response.status(200).json(users);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

/**
 * GET : Get single user by id
 * @path_variable {string} id - user_id of a user.
 */
export const getUser = async (request: Request, response: Response) => {
  try {
    const user = await UserService.getSingleUserById(request.params.id);
    if (!user) {
      return response.status(400).json({
        error: { msg: "No user exist with this id." },
      });
    }
    return response.status(200).json(user);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

/**
 * POST : Create a new user controller
 * @request_body {Omit<User, "user_type" | "status" | "user_id" | "updated_by">}
 */
export const createNewUser = async (request: Request, response: Response) => {
  //Check if there is any error
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  //Get User Data From Request Body
  const user: Omit<User, "user_type" | "status" | "user_id" | "updated_by"> =
    request.body;

  //Hash user password with argon2
  user.password = await argon2.hash(user.password);

  try {
    //Create a new user
    const newUser = await UserService.createUser(user);
    return response.status(200).json(newUser);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * PUT : Update user data
 * @request_body {ChangableUserType} - user can able to change bio and user_name only
 */
export const updateUserData = async (request: Request, response: Response) => {
  //Check if there is any error
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  //Check whether the user with this id exists in the database.
  const user = await UserService.getSingleUserById(request.params.id);
  if (!user) {
    return response.status(400).json({
      error: { msg: "No user exist with this id." },
    });
  }

  //Get User Data From Request Body
  const changedUser: ChangableUserType = request.body;

  try {
    //Update user data
    const updatedUser = await UserService.updateUserData(
      request.params.id,
      changedUser
    );
    return response.status(200).json(updatedUser);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * DELETE : delete a user by id
 * @path_variable {string} id - user_id of a user
 */
export const deleteUser = async (request: Request, response: Response) => {
  //Check whether the user with this id exists in the database.
  const user = await UserService.getSingleUserById(request.params.id);
  if (!user) {
    return response.status(400).json({
      error: { msg: "No user exist with this id." },
    });
  }

  try {
    //delete user
    const deletedUser = await UserService.deleteUser(request.params.id);
    return response.status(200).json(deletedUser);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};
