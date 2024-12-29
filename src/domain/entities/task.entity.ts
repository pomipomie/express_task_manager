import { taskStatus } from "../../utils/enums/taskStatus.enum";
import { IProject } from "../interfaces/project.interface";
import { ITask } from "../interfaces/task.interface";
import { IUser } from "../interfaces/user.interface";
import { Metadata } from "./metadata.entity";

export class Task extends Metadata implements ITask {
	name: string;
	description: string;
	users: IUser[];
	project: IProject;
	status: taskStatus;
	dueDate: Date;

	constructor(
		id: string,
		createdAt: Date,
		updatedAt: Date,
		name: string,
		description: string,
		users: IUser[],
		project: IProject,
		status: taskStatus,
		dueDate: Date
	) {
		super(id, createdAt, updatedAt);
		this.name = name;
		this.description = description;
		this.users = users;
		this.project = project;
		this.status = status;
		this.dueDate = dueDate;
	}
}

export type TQuery = {
	id?: string;
	name?: string;
	description?: string;
	users?: IUser[];
	project?: IProject;
	status: taskStatus;
	dueDate?: Date;
};
