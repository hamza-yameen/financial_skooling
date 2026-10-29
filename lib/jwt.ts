export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  exp?: number;
}

export const COOKIE_NAME = "finskool_session";

// 30 days expiration in seconds
export const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 30;

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "financial_skooling_jwt_super_secret_key_production_2026_modern_quant";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function textToBase64Url(text: string): string {
  const bytes = textEncoder.encode(text);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToText(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return textDecoder.decode(bytes);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBytes(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

/**
 * Signs a payload with HMAC SHA-256 (HS256) into a standard JWT string.
 * Completely native Web Crypto API — zero external dependencies, Edge & Node compatible.
 */
export async function signJWT(
  payload: Omit<JWTPayload, "exp"> & { exp?: number }
): Promise<string> {
  const key = await getCryptoKey(["sign"]);

  const header = { alg: "HS256", typ: "JWT" };
  const exp = payload.exp ?? Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS;
  const fullPayload: JWTPayload = { ...payload, exp };

  const encodedHeader = textToBase64Url(JSON.stringify(header));
  const encodedPayload = textToBase64Url(JSON.stringify(fullPayload));
  const data = textEncoder.encode(`${encodedHeader}.${encodedPayload}`);

  const signature = await crypto.subtle.sign("HMAC", key, data);
  const encodedSignature = bytesToBase64Url(new Uint8Array(signature));

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Cryptographically verifies an HS256 JWT string and validates its expiration.
 * Returns the decoded JWTPayload if valid, or null if invalid, tampered, or expired.
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const key = await getCryptoKey(["verify"]);
    const data = textEncoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlToBytes(signatureB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      data
    );

    if (!isValid) return null;

    const payloadText = base64UrlToText(payloadB64);
    const payload = JSON.parse(payloadText) as JWTPayload;

    // Check expiration timestamp
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

