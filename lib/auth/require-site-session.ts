import { cookies } from "next/headers";
import { SITE_SESSION_COOKIE } from "@/lib/auth/cookie-name";
import { verifyAuthToken } from "@/lib/auth/session";

export async function requireSiteSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SITE_SESSION_COOKIE)?.value;
  if (!token || !(await verifyAuthToken(token))) {
    throw new Error("Unauthorized");
  }
}
