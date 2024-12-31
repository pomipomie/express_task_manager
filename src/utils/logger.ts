import { createLogger, transports, format } from "winston";

const logger = createLogger({
	level: "info",
	format: format.combine(
		format.colorize({ all: true }),
		format.timestamp({
			format: "YYYY-MM-DD hh:mm:ss.SSS A",
		}),
		format.align(),
		format.printf(
			(info) => `[${info.timestamp}] ${info.level}: ${info.message}`
		)
	),
	transports: [new transports.Console()],
});

export { logger };
