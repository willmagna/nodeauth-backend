export const PORT = process.env.PORT ?? "";
export const API_KEY = process.env.API_KEY ?? "";
export const BACK_END_BASE_URL = process.env.BACK_END_BASE_URL ?? "";
export const FRONT_END_BASE_URL = process.env.FRONT_END_BASE_URL ?? "";

export const MONGODB_URI = process.env.MONGODB_URI ?? "";

export const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN ?? "";
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN ?? "";
export const ACCESS_SECRET = process.env.ACCESS_SECRET ?? "";
export const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "";

export const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const WINDOW_IN_SECONDS = process.env
  .GLOBAL_RATE_LIMITER_WINDOW_IN_SECONDS
  ? Number(process.env.GLOBAL_RATE_LIMITER_WINDOW_IN_SECONDS)
  : 5 * 60;
export const MAX_REQUESTS = process.env.GLOBAL_RATE_LIMITER_MAX_REQUESTS
  ? Number(process.env.GLOBAL_RATE_LIMITER_MAX_REQUESTS)
  : 100;
