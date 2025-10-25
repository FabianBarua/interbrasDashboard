import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@root/db/config";
import { Users } from "@root/db/schema";
import { eq } from "drizzle-orm";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.query.Users.findFirst({
    where: eq(Users.id, session.user.id),
  });

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return { session, user };
}

export async function getSessionUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await db.query.Users.findFirst({
    where: eq(Users.id, session.user.id),
  });

  return user;
}
