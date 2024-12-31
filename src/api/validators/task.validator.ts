import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { taskStatus } from "../../utils/enums/taskStatus.enum";

export const createTaskValidator = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
		users: Joi.array().items(Joi.string()),
		project: Joi.string().required(),
		status: Joi.string().valid(
			taskStatus.PENDING,
			taskStatus.INPROGRESS,
			taskStatus.COMPLETED
		),
		dueDate: Joi.date().iso().required(),
	});
	const { error, value } = schema.validate(req.body, { abortEarly: false });

	if (error) {
		// Return all errors if validation fails
		res.status(406).json({
			success: false,
			message: "Task validation failed",
			errors: error.details.map((detail) => detail.message),
		});
	}
	req.body = value; // Replace `req.body` with validated data

	// Proceed to the next middleware/controller
	next();
};

export const findTaskValidator = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const schema = Joi.object({
		name: Joi.string(),
		description: Joi.string(),
		users: Joi.array().items(Joi.string()),
		project: Joi.string(),
		status: Joi.string().valid(
			taskStatus.PENDING,
			taskStatus.INPROGRESS,
			taskStatus.COMPLETED
		),
		dueDate: Joi.date().iso(),
	});
	const { error, value } = schema.validate(req.query, { abortEarly: false });

	if (error) {
		// Return all errors if validation fails
		res.status(406).json({
			success: false,
			message: "Query validation failed",
			errors: error.details.map((detail) => detail.message),
		});
	}
	req.query = value; // Replace `req.body` with validated data

	// Proceed to the next middleware/controller
	next();
};
