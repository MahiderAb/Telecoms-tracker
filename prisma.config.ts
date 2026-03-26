// prisma.config.ts

import "dotenv/config"; // <-- Add this line at the very top
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
});
