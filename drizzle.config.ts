import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/db",
  out: "src/db/generated",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://postgres:postgres@localhost:5432/gator",
  },
});
