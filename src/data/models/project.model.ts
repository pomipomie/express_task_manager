import { Schema, model } from "mongoose";
import { Project, PQuery } from "../../domain/entities/project.entity";
import { IProject } from "../../domain/interfaces/project.interface";

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - users
 *         - status
 *         - dueDate
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the project
 *         description:
 *           type: string
 *           description: The description of the project
 *         users:
 *           type: IUser[]
 *           description: The listn of users associated with the project
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the project was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the project was last updated
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: When the project is due
 */

const ProjectSchema = new Schema<IProject>(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
		status: { type: String, required: true },
		dueDate: { type: Date, required: true },
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

export default model<IProject>("Project", ProjectSchema);

export const Mapper = {
	toQuery: (query: PQuery) => {
		return {
			...(query.id && { _id: query.id }),
			...(query.name && { firstName: query.name }),
			...(query.description && { description: query.description }),
			...(query.users && { users: query.users }),
			...(query.status && { status: query.status }),
			...(query.dueDate && { dueDate: query.dueDate }),
		};
	},

	toEntity: (model: IProject): Project =>
		new Project(
			model.id,
			model.createdAt,
			model.updatedAt,
			model.name,
			model.description,
			model.users,
			model.status,
			model.dueDate
		),
};
