import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate.js";
import { forbidden } from "../utils/apiResponse.js";

export function authorize(...allowedRoles: ("USER" | "ADMIN")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      forbidden(res, "Authentication required");
      return;
    }

    if (!allowedRoles.includes(req.user.role as "USER" | "ADMIN")) {
      forbidden(res, "Insufficient permissions");
      return;
    }

    next();
  };
}