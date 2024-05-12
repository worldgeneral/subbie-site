import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import { client } from "./db/db";
import { errorHandler } from "./errors/error-handler.middleware";
import { AppError } from "./errors/express-error";
import { authRoutes } from "./modules/auth-module/auth.router";
import { companiesRoutes } from "./modules/company-module/companies.router";
import { contractorsRoutes } from "./modules/contractor-module/contractors.router";
import { jobsRoutes } from "./modules/job-module/jobs.router";
import { ratingsRoutes } from "./modules/rating-module/ratings.router";
import { usersRoutes } from "./modules/user-module/users.router";

const app = express();

async function main() {
  await client.connect();

  app.use(express.json());
  app.use(cookieParser());

  app.use(usersRoutes);
  app.use(authRoutes);
  app.use(companiesRoutes);
  app.use(contractorsRoutes);
  app.use(jobsRoutes);
  app.use(ratingsRoutes);

  app.all("*", (req, res, next) => {
    next(new AppError("page not found", 404));
  });

  app.use(errorHandler);

  app.listen(3001, () => {
    console.log("http://localhost:3001");
  });
}

main();
