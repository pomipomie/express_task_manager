import { taskStatus } from "../../utils/enums/taskStatus.enum";
import { IMetadata } from "./metadata.interface";
import { IUser } from "./user.interface";

export interface IProject extends IMetadata {
	name: string;
	description: string;
	users: IUser[];
	status: taskStatus;
	dueDate: Date;
}
