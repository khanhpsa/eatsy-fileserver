import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { createLogger, format } = winston;

const { combine, timestamp, printf } = format;

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD" }),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl, statusCode } = req;
    const logLevel = statusCode >= 400 ? "error" : "info";

    logger.log(
      logLevel,
      `${method} ${originalUrl} ${statusCode} [${duration}ms]`
    );
  });

  next();
}
