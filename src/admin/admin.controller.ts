import { ExpressValidator, validationResult } from "express-validator";
import * as AdminService from "./admin.services";
import { db } from "../utils/db.server";

export const { body } = new ExpressValidator({
  //Check if there is an admin already existed with this id.
  isLoginIdNotInUse: async (id: string) => {
    const admin = await AdminService.getSingleAdmin(id);
    if (admin) {
      throw new Error("Login-id already in use");
    }
  },

  //Check if there is an admin already existed with this username.
  isUsernameNotInUse: async (username: string) => {
    const admin = await db.admin.findUnique({
      where: {
        name: username,
      },
    });
    if (admin) {
      throw new Error("Username already in use");
    }
  },
});

import type { Request, Response } from "express";

export const getListOfAdmin = async (request: Request, response: Response) => {
  try {
    const admins = await AdminService.getAdmins();
    return response.status(200).json(admins);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

export const getSingleAdmin = async (request: Request, response: Response) => {
  try {
    const admin = await AdminService.getSingleAdmin(request.params.id);
    if (admin) {
      return response.status(200).json(admin);
    }
    return response.status(404).json("Admin not found with this id");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

export const createAnAdmin = async (request: Request, response: Response) => {
  //Check if there is any errors in body payload
  const errors = await validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  try {
    //Create an admin
    const { login_id, name, password } = request.body;
    const newAdmin = await AdminService.createAdmin({
      login_id,
      name,
      password,
    });
    return response.status(200).json(newAdmin);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const updatePasswordOfAdmin = async (
  request: Request,
  response: Response
) => {
  const errors = await validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }
  try {
    const { password } = request.body;

    //Check if an admin with this id existed in the database.
    const admin = await AdminService.getSingleAdmin(request.params.id);
    if (!admin) {
      return response.status(400).json({ error: { msg: "Admin not found." } });
    }

    //Update admin password.
    const updatedAdmin = await AdminService.updatePassword(
      password,
      request.params.id
    );
    return response.status(200).json(updatedAdmin);
  } catch (error) {
    return response.status(500).json(error.message);
  }
};

export const deleteAnAdminById = async (
  request: Request,
  response: Response
) => {
  try {
    //Check if an admin with this id existed in the database.
    const admin = await AdminService.getSingleAdmin(request.params.id);
    if (!admin) {
      return response.status(400).json({ error: "Admin not found." });
    }

    //Delete admin with this id.
    const deletedAdmin = await AdminService.deleteAdmin(request.params.id);
    if (deletedAdmin) {
      return response.status(200).json(deletedAdmin);
    }
    return response.status(400).json();
  } catch (error) {
    return response.status(500).json(error.message);
  }
};
