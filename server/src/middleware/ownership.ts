import { Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { AuthenticatedRequest } from "./authenticate.js";
import { forbidden, notFound } from "../utils/apiResponse.js";

export function ownership(
  resource: "note" | "user",
  resourceIdParam: string
) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      forbidden(res, "Authentication required");
      return;
    }

    if (req.user.role === "ADMIN") {
      next();
      return;
    }

    const id = req.params[resourceIdParam];

    if (resource === "note") {
      const note = await prisma.note.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!note) {
        notFound(res, "Note not found");
        return;
      }

      if (note.userId !== req.user.userId) {
        forbidden(res, "You can only access your own notes");
        return;
      }
    }

    next();
  };
}