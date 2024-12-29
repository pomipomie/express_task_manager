import { Schema, model } from "mongoose";
import { Project, PQuery } from "../../domain/entities/project.entity";
import { IProject } from "../../domain/interfaces/project.interface";
import { User } from "../../domain/entities/user.entity";

const ProjectSchema = new Schema<IProject>(
	{
		id: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		users: { type: [User], required: true },
		status: { type: String, required: true },
		dueDate: { type: Date, required: true },
	},
	{ timestamps: true }
);

export default model<IProject>("Project", ProjectSchema);

export const Mapper = {
	toQuery: (query: PQuery) => {
		return {
			...(query.id && { id: query.id }),
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
