import { Schema, model } from "mongoose";
import { User } from "../../domain/entities/user.entity";
import { IUser } from "../../domain/interfaces/user.interface";
import { roles } from "../../utils/enums/roles.enum";
import { CreateParams, Query } from "../../domain/dto/user.dto";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - firstName
 *         - lastName
 *         - email
 *         - auth
 *       properties:
 *         username:
 *           type: string
 *           description: The username
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *         auth:
 *           type: object
 *           description: Authentication and authorization information
 */

const UserSchema = new Schema<IUser>(
	{
		username: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		auth: {
			password: { type: String, required: true },
			token: { type: String, default: "" },
			role: { type: String, required: true, default: roles.USER },
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true, // Include virtual fields
			transform: (doc, ret) => {
				ret.id = ret._id.toString(); // Map `_id` to `id`
				delete ret._id; // Remove `_id` from the output
				delete ret.__v; // Remove `__v` (version key)
			},
		},
	}
);

export default model<IUser>("User", UserSchema);

export const Mapper = {
	toDtoCreation: (payload: CreateParams) => {
		return {
			username: payload.username,
			firstName: payload.firstName,
			lastName: payload.lastName,
			email: payload.email,
			password: payload.password,
		};
	},

	toQuery: (query: Query) => {
		return {
			...(query.id && { id: query.id }),
			...(query.firstName && { firstName: query.firstName }),
			...(query.lastName && { lastName: query.lastName }),
			...(query.username && { username: query.username }),
			...(query.email && { email: query.email }),
			...(query.role && { role: query.role }),
		};
	},

	toEntity: (model: IUser): User =>
		new User(
			model.id,
			model.createdAt,
			model.updatedAt,
			model.username,
			model.firstName,
			model.lastName,
			model.email,
			model.auth
		),
};
