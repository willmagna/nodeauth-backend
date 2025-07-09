import { FRONT_END_BASE_URL, NODE_ENV } from "@/config/env/env.js";
import cors from "cors";

const allowedOrigins = [FRONT_END_BASE_URL, "http://localhost:5173"];

export const corsSetup = cors({
  origin: (origin, callback) => {
    if (!origin || NODE_ENV == "development") return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,
});
