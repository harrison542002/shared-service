import jwt from "jsonwebtoken";
export const generateAccessToken = (signObject: any) => {
  return jwt.sign(signObject, process.env.TOKEN_SECRET, { expiresIn: "10h" });
};
