import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import { companySchema } from "../zodSchema/companySchema";
import { registerCompany } from "../services/company.service";

const companyRoutes = Router();

companyRoutes.post(
  "/companies",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = companySchema.parse(req.body);
    const company = await registerCompany(
      data.name,
      data.logo,
      data.blurb,
      req.user!.id
    );
    res.json(company).status(201);
  })
);

companyRoutes.post(
  "/companies/:id/users",
  sessionAuth,
  tryCatch(async (req: Request, res) => {})
);
