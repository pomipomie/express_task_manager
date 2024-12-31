import { HttpStatusCode } from "../enums/httpStatusCode.enum";
import { BaseError } from "./baseError";

export class ClientError extends BaseError {
	constructor(
		name: string,
		httpCode: HttpStatusCode = HttpStatusCode.NOT_FOUND,
		description: string = "Not Found",
		isOperational: boolean = true
	) {
		super(name, httpCode, description, isOperational);
	}
}
