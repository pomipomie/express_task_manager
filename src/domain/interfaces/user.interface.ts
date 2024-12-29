import { IMetadata } from "./metadata.interface";

export interface IUser extends IMetadata {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	auth: {
		password: string;
		token: string;
		role: string;
	};
}
