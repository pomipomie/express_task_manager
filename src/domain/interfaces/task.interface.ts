import { taskState } from "../../utils/enums/taskState.enum";
import { IMetadata } from "./metadata.interface";
import { IProject } from "./project.interface";
import { IUser } from "./user.interface";

export interface ITask extends IMetadata {
	name: string;
	description: string;
	users: IUser[];
	project: IProject;
	state: taskState;
	dueDate: Date;
}
