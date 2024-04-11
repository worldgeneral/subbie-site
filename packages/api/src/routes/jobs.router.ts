import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { sessionAuth } from "../middleware/sessionAuth";
import { companyAuth } from "../middleware/companyAuth";
import { UserCompanyRole } from "../services/company.service";
import { getJobPostsSchema, jobPostsSchema } from "../zodSchema/jobPostSchema";
import {
  createJobPost,
  deleteJobPost,
  getCompanyJobPosts,
  getJobPost,
  getJobPosts,
  updateJobPost,
} from "../services/jobPosts.service";

const jobsRoutes = Router();

jobsRoutes.get(
  "/jobs",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const data = getJobPostsSchema.parse(req.body);
    const jobPosts = await getJobPosts(data.limit, data.offset);
    res.json(jobPosts);
  })
);

jobsRoutes.get(
  "/company/:companyId/jobs",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const companyId = Number(req.params.companyId);
    const data = getJobPostsSchema.parse(req.body);
    const jobPosts = await getCompanyJobPosts(
      companyId,
      data.limit,
      data.offset
    );
    res.json(jobPosts);
  })
);

jobsRoutes.get(
  "/jobs/:jobId",
  sessionAuth,
  tryCatch(async (req: Request, res) => {
    const jobPostId = Number(req.params.jobId);
    const jobPost = await getJobPost(jobPostId);
    res.json(jobPost);
  })
);

jobsRoutes.post(
  "/company/:companyId/jobs",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const data = jobPostsSchema.parse(req.body);
    const newJobPost = await createJobPost(data, req.usersCompany!);
    res.json(newJobPost).status(201);
  })
);

jobsRoutes.patch(
  "/company/:companyId/jobs/:jobId",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const data = jobPostsSchema.partial().parse(req.body);
    const jobPostId = Number(req.params.jobId);
    const companyId = Number(req.params.companyId);
    const updatedJobPost = await updateJobPost(
      { companyId, ...data },
      jobPostId
    );
    res.json(updatedJobPost);
  })
);

jobsRoutes.delete(
  "/company/:companyId/jobs/:jobId",
  sessionAuth,
  companyAuth(UserCompanyRole.Editor),
  tryCatch(async (req: Request, res) => {
    const jobPostId = Number(req.params.jobId);
    const deletedJobPost = await deleteJobPost(jobPostId);
    res.json(deletedJobPost);
  })
);

export { jobsRoutes };
