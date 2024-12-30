import { taskStatus } from "../../utils/enums/taskStatus.enum";
import { IUser } from "../interfaces/user.interface";

export interface PQuery {
	id?: string;
	name?: string;
	description?: string;
	users?: IUser[];
	status?: taskStatus;
	dueDate?: Date;
}

export interface PCreateParams {
	name: string;
	description: string;
	users: IUser[];
	status: taskStatus;
	dueDate: Date;
}
