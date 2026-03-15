const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

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
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};
