import { JwtPayload } from "../utils/jwt.js";

declare module "express" {
  export interface Request {
    user?: JwtPayload & {
      dbUser?: {
        id: string;
        email: string;
        role: string;
        createdAt: Date;
      };
    };
  }
}