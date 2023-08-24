import { db } from "../utils/db.server";
import * as argon2 from "argon2";

type Admin = {
  login_id: string;
  name: string;
  password: string;
  token: string;
  created_at: Date;
};

export const getAdmins = async (): Promise<
  Omit<Admin, "password" | "token">[]
> => {
  return db.admin.findMany({
    select: {
      login_id: true,
      name: true,
      created_at: true,
    },
  });
};

export const getSingleAdmin = async (
  id: string
): Promise<Omit<Admin, "password" | "token"> | null> => {
  return db.admin.findUnique({
    where: {
      login_id: id,
    },
    select: {
      login_id: true,
      name: true,
      created_at: true,
    },
  });
};

export const createAdmin = async (
  admin: Omit<Admin, "created_at" | "token">
): Promise<Omit<Admin, "password" | "token"> | null> => {
  const { login_id, name, password } = admin;

  //Generate Hash
  const hash = await argon2.hash(password);

  return db.admin.create({
    data: {
      login_id,
      name,
      password: hash,
    },
    select: {
      login_id: true,
      name: true,
      created_at: true,
    },
  });
};

export const updatePassword = async (
  password: string,
  id: string
): Promise<Omit<Admin, "password" | "token">> => {
  //Hash password with argon2
  const hash = await argon2.hash(password);

  return db.admin.update({
    where: {
      login_id: id,
    },
    data: {
      password: hash,
    },
    select: {
      login_id: true,
      name: true,
      created_at: true,
    },
  });
};

export const deleteAdmin = async (id: string) => {
  return db.admin.delete({
    where: {
      login_id: id,
    },
  });
};
