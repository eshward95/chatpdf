import * as dotenv from "dotenv";
// import type { Config } from "drizzle-kit";

dotenv.config({ path: ".env" });

import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL || "",
  },
  verbose: true,
  strict: true,
});
