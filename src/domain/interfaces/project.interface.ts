import { taskState } from "../../utils/enums/taskState.enum";
import { IMetadata } from "./metadata.interface";
import { IUser } from "./user.interface";

export interface IProject extends IMetadata {
	name: string;
	description: string;
	users: IUser[];
	state: taskState;
	dueDate: Date;
}
