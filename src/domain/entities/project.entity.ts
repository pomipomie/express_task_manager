import { taskState } from "../../utils/enums/taskState.enum";
import { IProject } from "../interfaces/project.interface";
import { IUser } from "../interfaces/user.interface";
import { Metadata } from "./metadata.entity";

export class Project extends Metadata implements IProject {
	name: string;
	description: string;
	users: IUser[];
	state: taskState;
	dueDate: Date;

	constructor(
		id: string,
		createdAt: Date,
		updatedAt: Date,
		name: string,
		description: string,
		users: IUser[],
		state: taskState,
		dueDate: Date
	) {
		super(id, createdAt, updatedAt);
		this.name = name;
		this.description = description;
		this.users = users;
		this.state = state;
		this.dueDate = dueDate;
	}
}

export type PQuery = {
	id?: string;
	name?: string;
	description?: string;
	users?: IUser[];
	state: taskState;
	dueDate?: Date;
};
