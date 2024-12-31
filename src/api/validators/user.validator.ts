import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { roles } from "../../utils/enums/roles.enum";

export const findUserValidator = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const objectId = Joi.string()
		.regex(/^[a-fA-F0-9]{24}$/)
		.message("Invalid MongoDB ObjectId format");
	const schema = Joi.object({
		id: objectId,
		username: Joi.string(),
		firstName: Joi.string(),
		lastName: Joi.string(),
		email: Joi.string().email(),
		role: Joi.string().valid(roles.ADMIN, roles.MANAGER, roles.USER),
	});
	const { error, value } = schema.validate(req.query, { abortEarly: false });

	if (error) {
		throw new ClientError(
			`[${error.name}] Query validation failed`,
			HttpStatusCode.NOT_ACCEPTABLE,
			error.details.map((detail) => detail.message).toString(),
			true
		);
	}
	req.query = value; // Replace `req.body` with validated data

	// Proceed to the next middleware/controller
	next();
};
