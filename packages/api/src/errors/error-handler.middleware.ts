import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpStatus } from "../constants/https";
import { AppError } from "./express-error";

export const errorHandler = (
  err: Error | unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof ZodError) {
    return res
      .status(HttpStatus.BadRequest)
      .json({ errorMessage: "Validation Error", issues: err.issues, err });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorMessage: err.message,
      err: err.stack,
    });
  }

  return res.status(HttpStatus.InternalServerError).json({
    message: "Something went wrong",
    err,
  });
};
