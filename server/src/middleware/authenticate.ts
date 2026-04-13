import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { unauthorized } from "../utils/apiResponse.js";

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  role: string;
  name: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    username?: string;
    name?: string;
  };
  authUser?: AuthUser;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      unauthorized(res, "Authorization token required");
      return;
    }

    const token = authHeader.substring(7);
    let payload: any;
    
    try {
      if (token.includes('.') && token.split('.').length === 3) {
        payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      } else {
        payload = JSON.parse(Buffer.from(token, 'base64').toString());
      }
      
      if (payload && payload.id) {
        req.user = {
          userId: payload.id,
          email: payload.email || "",
          role: payload.role || "USER",
          username: payload.username,
          name: payload.name,
        };
        
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            name: true,
          },
        });
        
        if (user) {
          req.authUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            name: user.name,
          };
        }
        
        next();
      } else {
        unauthorized(res, "Invalid token");
      }
    } catch (decodeError) {
      console.error("Token decode error:", decodeError);
      unauthorized(res, "Invalid token format");
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    unauthorized(res, "Authentication failed");
  }
}

export const requireAuth = authMiddleware;