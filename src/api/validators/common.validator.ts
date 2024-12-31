import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";

export const IDValidator = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const objectId = Joi.string()
		.regex(/^[a-fA-F0-9]{24}$/)
		.message("Invalid MongoDB ObjectId format");
	const schema = Joi.object({
		id: objectId.required(),
	});
	const { error, value } = schema.validate(req.params);
	if (error) {
		throw new ClientError(
			`[${error.name}] ID validation failed`,
			HttpStatusCode.NOT_ACCEPTABLE,
			error.details.map((detail) => detail.message).toString(),
			true
		);
	}
	req.params = value;
	next();
};
