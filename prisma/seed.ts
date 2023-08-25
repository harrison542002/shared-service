import { UserStatus, UserType } from "@prisma/client";
import { db, generateAccessToken } from "../src/utils";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

const seed = async () => {
  const hash = await argon2.hash("password");

  const admin_login_id = "aungthih";
  const admin_user_name = "aungthihamdy";
  const user_id = uuidv4();

  //Generate an admin token
  const adminToken = generateAccessToken({
    login_id: "aungthih",
    name: "aungthihamdy",
  });

  //Generate a user token
  const userToken = generateAccessToken({ user_id });

  /**
   * create a default admin for the system
   */
  await db.admin.create({
    data: {
      login_id: admin_login_id,
      name: admin_user_name,
      password: hash,
      token: adminToken,
    },
  });

  /**
   * create a default user with
   * email - aung@gmail.com
   * password - password
   */
  await db.user.create({
    data: {
      user_id: user_id,
      user_name: "aung",
      password: hash,
      user_type: UserType.NORMAL,
      status: UserStatus.Verify,
      email: "aung@gmail.com",
      token: userToken,
    },
  });

  //Create three categories "Technology", "Psychology", "Biology" with created admin username.
  await db.category.createMany({
    data: [
      {
        category_id: uuidv4(),
        name: "Technology",
        created_by: admin_user_name,
        updated_by: admin_user_name,
      },
      {
        category_id: uuidv4(),
        name: "Psychology",
        created_by: admin_user_name,
        updated_by: admin_user_name,
      },
      {
        category_id: uuidv4(),
        name: "Biology",
        created_by: admin_user_name,
        updated_by: admin_user_name,
      },
    ],
  });
};

seed().catch((error) => console.log(error));
