import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../utils/errors/baseError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";

export const errorHandler = (
	err: BaseError | Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		console.error("Headers already sent:", `${err.name} - ${err.message}`);
		next(err);
	}

	if (err instanceof BaseError) {
		console.error(`Error: ${err.name} - ${err.message} - ${err.httpCode}`);
		res.status(err.httpCode).json({
			success: false,
			name: err.name,
			message: err.message,
		});
	} else {
		console.error("Unexpected Error:", err);
		res.status(HttpStatusCode.INTERNAL_SERVER).json({
			success: false,
			name: "Internal Server Error",
			message: "An unexpected error occurred.",
		});
	}
};
