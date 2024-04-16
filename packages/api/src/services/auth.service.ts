import { db } from "../db";
import { AppError } from "../utils/express.error";
import { eq } from "drizzle-orm";
import { usersTable } from "../models/user.model";
import * as argon2 from "argon2";
import { normalizeUser } from "./user.service";
import { userSchema } from "../rules/user.rule";
import z from "zod";
import { randomStringAsBase64Url } from "../utils/unique.string";
import moment from "moment";
import { createHash } from "crypto";
import { sessionsTable } from "../schemas";

export type login = Required<
  Omit<z.infer<typeof userSchema>, "id" | "firstName" | "secondName">
>;

export async function loginAuthUser(password: string, email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    throw new AppError("user does not exist", 401);
  }
  if (!(await argon2.verify(user.password, password))) {
    throw new AppError("password or email is wrong", 401);
  }

  return normalizeUser(user);
}

export async function userLogin(userId: number) {
  const sessionToken = await randomStringAsBase64Url(128);
  const hashToken = createHash("sha256").update(sessionToken).digest("hex");

  await db.insert(sessionsTable).values({
    userId: userId,
    sessionToken: hashToken,
    expiresAt: moment().add(7, "days").toDate(),
  });

  return sessionToken;
}

export async function userLogout(sessionToken: string) {
  const hashToken = createHash("sha256").update(sessionToken).digest("hex");
  await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.sessionToken, hashToken));

  return;
}
