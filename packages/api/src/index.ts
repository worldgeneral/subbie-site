import "dotenv/config";
import express, { NextFunction } from "express";
import { AppError } from "./utils/ExpressError";
import { usersRoutes } from "./routes/users.router";
import { errorHandler } from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth.router";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(usersRoutes);
app.use(authRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("page not found", 404));
});

app.use(errorHandler);

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
