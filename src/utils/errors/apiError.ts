import { HttpStatusCode } from "../enums/httpStatusCode.enum";
import { BaseError } from "./baseError";

export class APIError extends BaseError {
	constructor(
		name: string,
		httpCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
		description: string = "internal server error",
		isOperational: boolean = true
	) {
		super(name, httpCode, description, isOperational);
	}
}
