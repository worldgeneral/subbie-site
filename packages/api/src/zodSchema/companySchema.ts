import { z } from "zod";

export const companySchema = z.object({
  name: z.string(),
  logo: z.string(),
  blurb: z.string(),
});
