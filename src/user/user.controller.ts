import { Request, Response } from "express";
import * as UserService from "./user.services";
import { User, ChangableUserType } from "./user.services";
import { ExpressValidator } from "express-validator";
import { UserStatus, UserType } from "@prisma/client";

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
  //Get User Data From Request Body
  const user: Omit<User, "user_type" | "status" | "user_id" | "updated_by"> =
    request.body;

  try {
    //Create a new user
    const newUser = await UserService.createUser(user);
    return response.status(200).json(newUser);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * Check user credentials, if it is correct, send a access token.
 */
export const signInUser = async (request: Request, response: Response) => {
  try {
    //Create an admin
    const { email, password } = request.body;
    const token = await UserService.userSignIn(email, password);

    //If token is null, return unauthorized.
    if (!token) {
      return response
        .status(403)
        .json({ error: { msg: "Incorrect Credentials." } });
    }

    //Otherwise, send access token to user.
    return response.status(200).json({ accessToken: token });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

/**
 * PUT : Update user data
 * @request_body {ChangableUserType} - user can able to change bio and user_name only
 */
export const updateUserData = async (request: Request, response: Response) => {
  //Check whether the user with this id exists in the database.
  const user = await UserService.getSingleUserById(request.params.id);
  if (!user) {
    return response.status(400).json({
      error: { msg: "No user exist with this id." },
    });
  }

  const updater_id = request.jwtPayload.user_id;
  if (updater_id !== request.params.id) {
    return response.status(400).json({
      error: { msg: "Only own user can modify his or her user data." },
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

/**
 * Verify by admin
 */
export const verifyUser = async (request: Request, response: Response) => {
  //Get login_id from jwt payload
  const { login_id } = request.jwtPayload;

  try {
    //Check if the user with this id exists in the database.
    const user = await UserService.getSingleUserById(request.params.id);
    if (!user) {
      return response
        .status(400)
        .json({ error: { msg: "User with this id does not exist." } });
    }

    if (user.status === UserStatus.Verify) {
      return response.status(400).json({
        error: { msg: "This user is already verified." },
      });
    }

    //Change user status to verify
    const verifiedUser = UserService.changeUserStatus(
      UserStatus.Verify,
      request.params.id,
      login_id
    );

    return response.status(200).json(verifiedUser);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * Suspend user by admin
 */
export const suspendUser = async (request: Request, response: Response) => {
  //Get login_id from jwt payload
  const { login_id } = request.jwtPayload;

  try {
    //Check if the user with this id exists in the database.
    const user = await UserService.getSingleUserById(request.params.id);
    if (!user) {
      return response
        .status(400)
        .json({ error: { msg: "User with this id does not exist." } });
    }

    if (user.status === UserStatus.Suspended) {
      return response.status(400).json({
        error: { msg: "This user is already suspended." },
      });
    }

    //Change user status to verify
    const suspendUser = UserService.changeUserStatus(
      UserStatus.Suspended,
      request.params.id,
      login_id
    );

    return response.status(200).json(suspendUser);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};

/**
 * Upgrade user type to premimun
 */
export const upgradeUser = async (request: Request, response: Response) => {
  //Get login_id from jwt payload
  const { login_id } = request.jwtPayload;

  try {
    //Check if the user with this id exists in the database.
    const user = await UserService.getSingleUserById(request.params.id);
    if (!user) {
      return response
        .status(400)
        .json({ error: { msg: "User with this id does not exist." } });
    }

    if (user.status !== UserStatus.Verify) {
      return response.status(400).json({
        error: { msg: "Unverified user cannot be upgraded to premium." },
      });
    }

    if (user.user_type === UserType.PREMIUM) {
      return response.status(400).json({
        error: { msg: "This user is already upgraded as premium." },
      });
    }

    //Change user status to verify
    const upgradedUser = UserService.changeUserType(
      UserType.PREMIUM,
      request.params.id,
      login_id
    );

    return response.status(200).json(upgradedUser);
  } catch (error) {
    return response.status(500).json({ error: { msg: error.message } });
  }
};
