import { companies, CompaniesSchema, companies_users } from "../schemas";
import { db } from "../db";

type Company = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  logo: string | null;
  blurb: string | null;
};

export async function registerCompany(
  name: string,
  logo: string | undefined,
  blurb: string | undefined,
  userId: number
): Promise<Company> {
  const [company] = await db
    .insert(companies)
    .values({
      name: name,
      logo: logo,
      blurb: blurb,
    })
    .returning();
  const [owner] = await db
    .insert(companies_users)
    .values({
      userId: userId,
      companyId: company.id,
      role: "owner",
    })
    .returning();

  return normalizeCompany(company);
}

export function normalizeCompany(company: CompaniesSchema): Company {
  return {
    id: company.id,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
    name: company.name,
    logo: company.logo,
    blurb: company.blurb,
  };
}
