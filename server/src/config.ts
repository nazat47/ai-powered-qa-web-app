import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  port: process.env.PORT || 3001,
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  geminiApiKey: process.env.GEMINI_API_KEY,
};
