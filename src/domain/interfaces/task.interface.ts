import { taskStatus } from "../../utils/enums/taskStatus.enum";
import { IMetadata } from "./metadata.interface";
import { IProject } from "./project.interface";
import { IUser } from "./user.interface";

export interface ITask extends IMetadata {
	name: string;
	description: string;
	users: IUser[];
	project: IProject;
	status: taskStatus;
	dueDate: Date;
}
