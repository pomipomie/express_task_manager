import { IUser } from "../interfaces/user.interface";
import { Auth } from "./auth.entity";
import { Metadata } from "./metadata.entity";

export class User extends Metadata implements IUser {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	auth: Auth;

	constructor(
		id: string,
		createdAt: Date,
		updatedAt: Date,
		username: string,
		firstName: string,
		lastName: string,
		email: string,
		auth: Auth
	) {
		super(id, createdAt, updatedAt);
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.auth = auth;
	}
}
