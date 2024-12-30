import { IAuth } from "./auth.interface";
import { IMetadata } from "./metadata.interface";

export interface IUser extends IMetadata {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	auth: IAuth;
}
