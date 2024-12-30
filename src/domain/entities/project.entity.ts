import { taskStatus } from "../../utils/enums/taskStatus.enum";
import { IProject } from "../interfaces/project.interface";
import { IUser } from "../interfaces/user.interface";
import { Metadata } from "./metadata.entity";

export class Project extends Metadata implements IProject {
	name: string;
	description: string;
	users: IUser[];
	status: taskStatus;
	dueDate: Date;

	constructor(
		id: string,
		createdAt: Date,
		updatedAt: Date,
		name: string,
		description: string,
		users: IUser[],
		status: taskStatus,
		dueDate: Date
	) {
		super(id, createdAt, updatedAt);
		this.name = name;
		this.description = description;
		this.users = users;
		this.status = status;
		this.dueDate = dueDate;
	}
}
