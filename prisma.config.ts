try {
  require("dotenv/config");
} catch {
  // dotenv is optional in production container
}

let defineConfig: any;
try {
  defineConfig = require("prisma/config").defineConfig;
} catch {
  defineConfig = (config: any) => config;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
