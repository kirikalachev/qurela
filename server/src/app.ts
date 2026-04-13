import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { error } from "./utils/apiResponse.js";

export function createApp(): Application {
  const app = express();

  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));

  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ success: true, message: "Server is running" });
  });

  app.use("/api", apiRoutes);

  app.use((_req: Request, res: Response) => {
    error(res, "Route not found", 404);
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    error(res, "Internal server error", 500);
  });

  return app;
}