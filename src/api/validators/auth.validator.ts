import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { roles } from "../../utils/enums/roles.enum";

export const createUserValidator = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const passwordSchema = Joi.string()
		.min(8) // Minimum length of 8 characters
		.max(30) // Maximum length of 30 characters
		.pattern(new RegExp(/[A-Z]/)) // At least one uppercase letter
		.pattern(new RegExp(/[a-z]/)) // At least one lowercase letter
		.pattern(new RegExp(/[0-9]/)) // At least one digit
		.pattern(new RegExp(/[@$!%*?&]/)) // At least one special character
		.messages({
			"string.base": "Password must be a string",
			"string.empty": "Password cannot be empty",
			"string.min": "Password must be at least 8 characters long",
			"string.max": "Password cannot exceed 30 characters",
			"string.pattern.base":
				"Password must include uppercase, lowercase, a digit, and a special character",
		});
	const schema = Joi.object({
		username: Joi.string(),
		firstName: Joi.string(),
		lastName: Joi.string(),
		email: Joi.string().email(),
		password: passwordSchema,
	});
	const { error, value } = schema.validate(req.body, { abortEarly: false });

	if (error) {
		throw new ClientError(
			`[${error.name}] Data validation failed`,
			HttpStatusCode.NOT_ACCEPTABLE,
			error.details.map((detail) => detail.message).toString(),
			true
		);
	}
	req.body = value; // Replace `req.body` with validated data

	// Proceed to the next middleware/controller
	next();
};

export const loginUserValidator = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const schema = Joi.object({
		email: Joi.string().email(),
		// Login password not validated with the same criteria as in registration to avoid conflicts with existing passwords if password creation criteria changes
		password: Joi.string(),
	});
	const { error, value } = schema.validate(req.body, { abortEarly: false });

	if (error) {
		throw new ClientError(
			`[${error.name}] Data validation failed`,
			HttpStatusCode.NOT_ACCEPTABLE,
			error.details.map((detail) => detail.message).toString(),
			true
		);
	}
	req.body = value; // Replace `req.body` with validated data

	// Proceed to the next middleware/controller
	next();
};
