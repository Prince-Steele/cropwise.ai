const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

const candidateEnvPaths = [
  path.join(__dirname, "../../.env.local"),
  path.join(__dirname, "../../.env"),
  path.join(__dirname, "../../../.env.local"),
  path.join(__dirname, "../../../.env"),
];

// Support the common backend/.env and backend/.env.local workflow first,
// while still allowing a repo-root fallback when teams keep shared envs there.
candidateEnvPaths
  .filter((envPath, index) => candidateEnvPaths.indexOf(envPath) === index)
  .forEach((envPath) => {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }
  });

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:4200",
  commoditiesApi: {
    baseUrl:
      process.env.COMMODITIES_API_BASE_URL || "https://commodities-api.com/api",
    apiKey: process.env.COMMODITIES_API_KEY,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    keepAliveTable:
      process.env.SUPABASE_KEEPALIVE_TABLE || "crop_recommendations",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};
