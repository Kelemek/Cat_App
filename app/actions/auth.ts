"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_SESSION_COOKIE } from "@/lib/auth/cookie-name";
import { signAuthCookie } from "@/lib/auth/session";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.SITE_PASSWORD;

  if (!expected) {
    return { error: "Server is not configured (missing SITE_PASSWORD)." };
  }

  if (password !== expected) {
    return { error: "That password does not match." };
  }

  const token = await signAuthCookie();
  const jar = await cookies();
  jar.set(SITE_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SITE_SESSION_COOKIE);
  redirect("/login");
}
