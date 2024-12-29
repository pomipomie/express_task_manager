import { IUser } from "../interfaces/user.interface";
import { Metadata } from "./metadata.entity";

export class User extends Metadata implements IUser {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	//placeholder
	auth: {
		password: string;
		token: string;
		role: string;
	};

	constructor(
		id: string,
		createdAt: Date,
		updatedAt: Date,
		username: string,
		firstName: string,
		lastName: string,
		email: string,
		//placeholder
		auth: {
			password: string;
			token: string;
			role: string;
		}
	) {
		super(id, createdAt, updatedAt);
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.auth = auth;
	}
}

export type CreateParams = {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	auth: {
		password: string;
		token: string;
		role: string;
	};
};

export type Query = {
	id?: string;
	username?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	role?: string;
};
