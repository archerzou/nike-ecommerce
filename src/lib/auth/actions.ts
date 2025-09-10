"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { db } from "../db";
import { guest } from "../db/schema/guest";
import { eq } from "drizzle-orm";

const EmailSchema = z.string().email();
const PasswordSchema = z.string().min(6);

const SignUpSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z.string().optional(),
});

const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

const SevenDaysMs = 7 * 24 * 60 * 60 * 1000;

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = cookieStore.get("guest_session");
  if (existing?.value) return existing.value;

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SevenDaysMs);

  await db.insert(guest).values({
    sessionToken: token,
    expiresAt,
  });

  cookieStore.set("guest_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function guestSession() {
  const cookieStore = await cookies();
  let token = cookieStore.get("guest_session")?.value;
  if (!token) {
    token = await createGuestSession();
  }
  return token;
}

async function clearGuestSessionRecord(token: string | undefined | null) {
  if (!token) return;
  await db.delete(guest).where(eq(guest.sessionToken, token));
}

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "";
  return url || ""; // relative fetch to Next route if empty
}

export async function signUp(input: z.infer<typeof SignUpSchema>) {
  const data = SignUpSchema.parse(input);
  const res = await fetch(`${getBaseUrl()}/api/auth/sign-up`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Sign up failed");
  }

  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;

  await mergeGuestCartWithUserCart(guestToken);

  cookieStore.delete("guest_session");
  await clearGuestSessionRecord(guestToken);

  return true;
}

export async function signIn(input: z.infer<typeof SignInSchema>) {
  const data = SignInSchema.parse(input);
  const res = await fetch(`${getBaseUrl()}/api/auth/sign-in`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Sign in failed");
  }

  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;

  await mergeGuestCartWithUserCart(guestToken);

  cookieStore.delete("guest_session");
  await clearGuestSessionRecord(guestToken);

  return true;
}

export async function signOut() {
  const res = await fetch(`${getBaseUrl()}/api/auth/sign-out`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Sign out failed");
  }
  return true;
}

export async function mergeGuestCartWithUserCart(guestToken?: string | null) {
  return { merged: true, guestToken: guestToken ?? null };
}
