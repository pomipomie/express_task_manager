import { Schema, model } from "mongoose";
import { Task } from "../../domain/entities/task.entity";
import { ITask } from "../../domain/interfaces/task.interface";
import { TCreateParams, TQuery } from "../../domain/dto/task.dto";
import { taskStatus } from "../../utils/enums/taskStatus.enum";

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - users
 *         - project
 *         - status
 *         - dueDate
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         users:
 *           type: IUser[]
 *           description: The listn of users associated with the task
 *         status:
 *           type: string
 *           description: The status of the task
 *         project:
 *           type: string
 *           description: The project associated with the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the task was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the task was last updated
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: When the task is due
 */

const TaskSchema = new Schema<ITask>(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
		project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		status: { type: String, required: true, default: taskStatus.PENDING },
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

export default model<ITask>("Task", TaskSchema);

export const Mapper = {
	toDtoCreation: (payload: TCreateParams) => {
		return {
			name: payload.name,
			description: payload.description,
			users: payload.users,
			project: payload.project,
			status: payload.status,
			dueDate: payload.dueDate,
		};
	},

	toQuery: (query: TQuery) => {
		return {
			...(query.id && { id: query.id }),
			...(query.name && { name: query.name }),
			...(query.description && { description: query.description }),
			...(query.users && { users: query.users }),
			...(query.project && { project: query.project }),
			...(query.status && { status: query.status }),
			...(query.dueDate && { dueDate: query.dueDate }),
		};
	},

	toEntity: (model: ITask): Task =>
		new Task(
			model.id,
			model.createdAt,
			model.updatedAt,
			model.name,
			model.description,
			model.users,
			model.project,
			model.status,
			model.dueDate
		),
};
