import { Schema, model } from "mongoose";
import { Query, User } from "../../domain/entities/user.entity";
import { IUser } from "../../domain/interfaces/user.interface";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - firstName
 *         - lastName
 *         - email
 *         - auth
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user
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
 */

const UserSchema = new Schema<IUser>(
	{
		id: { type: String, required: true },
		username: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		//placeholder
		auth: {
			password: { type: String, required: true },
			token: { type: String, required: true },
			role: { type: String, required: true },
		},
	},
	{ timestamps: true }
);

export default model<IUser>("User", UserSchema);

export const Mapper = {
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
