import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare, hash } from "bcryptjs";
import { prisma } from "./config/database.js";

interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: string;
  passwordHash: string | null;
}

// Export functions for custom auth (register, etc.)
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}

// Simple auth handler that returns the adapter and config
export const prismaAdapter = PrismaAdapter(prisma);

// Custom credentials authorizer function
export async function authorizeUser(email: string, password: string): Promise<any | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  }) as User | null;

  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}