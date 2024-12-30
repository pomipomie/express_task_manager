import { taskStatus } from "../../utils/enums/taskStatus.enum";
import { IProject } from "../interfaces/project.interface";
import { IUser } from "../interfaces/user.interface";

export interface TQuery {
	id?: string;
	name?: string;
	description?: string;
	users?: IUser[];
	project?: IProject;
	status?: taskStatus;
	dueDate?: Date;
}

export interface TCreateParams {
	name: string;
	description: string;
	users: IUser[];
	project: IProject;
	status: taskStatus;
	dueDate: Date;
}
