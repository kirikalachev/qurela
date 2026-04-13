import "dotenv/config";  // Load at the very start

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";


async function main(): Promise<void> {
  const app = createApp();

  await prisma.$connect();

  console.log("Connected to database");

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});