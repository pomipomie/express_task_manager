import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../utils/errors/baseError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { logger } from "../../utils/logger";

export const errorHandler = (
	err: BaseError | Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		logger.error("Headers already sent:", `${err.name} - ${err.message}`);
		next(err);
	}

	if (err instanceof BaseError) {
		logger.error(`Error: ${err.name} - ${err.message} - ${err.httpCode}`);
		res.status(err.httpCode).json({
			success: false,
			name: err.name,
			message: err.message,
		});
	} else {
		logger.error("Unexpected Error:", err.name, err.message);
		res.status(HttpStatusCode.INTERNAL_SERVER).json({
			success: false,
			name: err.name ?? "Internal Server Error",
			message: err.message ?? "An unexpected error occurred.",
		});
	}
};
