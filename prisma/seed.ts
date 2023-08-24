import { db } from "../src/utils/db.server";
import * as argon2 from "argon2";

const seed = async () => {
  const hash = await argon2.hash("adminpassword");

  /**
   * create a default admin for the system
   */
  return await db.admin.create({
    data: {
      login_id: "aungthih",
      name: "aungthihamdy",
      password: hash,
    },
  });
};

seed();
