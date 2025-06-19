import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      options: { translateTime: "UTC:yyyy-mm-dd HH:MM:ss" },
    },
  ],
});

// @ts-ignore
const logger = pino(
  {
    level: "debug",
  },
  transport
);

export default logger;
