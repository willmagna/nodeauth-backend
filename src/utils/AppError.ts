import logger from "@/lib/logger.js";

export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    logger.error(`${status} - ${message}`);
    this.status = status;
  }
}
