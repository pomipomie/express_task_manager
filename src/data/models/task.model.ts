import { Schema, model } from "mongoose";
import { Task, TQuery } from "../../domain/entities/task.entity";
import { ITask } from "../../domain/interfaces/task.interface";
import { User } from "../../domain/entities/user.entity";
import { Project } from "../../domain/entities/project.entity";

const TaskSchema = new Schema<ITask>(
	{
		id: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		users: { type: [User], required: true },
		project: { type: Project, required: true },
		status: { type: String, required: true },
		dueDate: { type: Date, required: true },
	},
	{ timestamps: true }
);

export default model<ITask>("Task", TaskSchema);

export const Mapper = {
	toQuery: (query: TQuery) => {
		return {
			...(query.id && { id: query.id }),
			...(query.name && { firstName: query.name }),
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
