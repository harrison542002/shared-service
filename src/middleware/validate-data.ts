import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateBodyData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //Check if there is any errors in body payload
  const errors = await validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array() });
  }

  next();
};
