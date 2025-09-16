import dotenv from "dotenv";

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const TEST = process.env.NODE_ENV === "test";

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 7500;

export const DATABASE_URL = process.env.DATABASE_URL ?? "";

export const CLIENT_URL = DEVELOPMENT
  ? "http://localhost:5173"
  : process.env.CLIENT_URL;

export const ACCESS_SECRET = process.env.ACCESS_SECRET || "";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "";

export const SERVER = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};
