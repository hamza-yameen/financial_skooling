import { cookies } from "next/headers";
import { prisma } from "./prisma";
import {
  COOKIE_NAME,
  TOKEN_EXPIRY_SECONDS,
  signJWT,
  verifyJWT,
  type JWTPayload,
} from "./jwt";

export { COOKIE_NAME, signJWT, verifyJWT, type JWTPayload };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  avatar: string | null;
  bio: string | null;
}

export type SetSessionInput =
  | string
  | {
      id: string;
      email: string;
      name: string;
      role: "STUDENT" | "ADMIN";
    };

/**
 * Retrieve authenticated user from the signed JWT session cookie.
 * Uses verified cryptographic token directly — zero database connection overhead,
 * preventing connection pool exhaustion on cloud databases like DigitalOcean.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie?.value) {
      return null;
    }

    const payload = await verifyJWT(sessionCookie.value);
    if (!payload?.userId) {
      return null;
    }

    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      avatar: null,
      bio: null,
    };
  } catch (error) {
    console.error("Error reading session user:", error);
    return null;
  }
}

/**
 * Signs a cryptographic JWT containing the user identity and persists it in an HttpOnly session cookie.
 */
export async function setSession(input: SetSessionInput): Promise<string> {
  let userId: string;
  let email: string;
  let name: string;
  let role: "STUDENT" | "ADMIN";

  if (typeof input === "string") {
    userId = input;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, role: true },
    });
    if (!user) {
      throw new Error("User not found while establishing session");
    }
    email = user.email;
    name = user.name;
    role = user.role;
  } else {
    userId = input.id;
    email = input.email;
    name = input.name;
    role = input.role;
  }

  const token = await signJWT({
    userId,
    email,
    name,
    role,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRY_SECONDS,
  });

  return token;
}

/**
 * Destroys the current authenticated session cookie.
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
