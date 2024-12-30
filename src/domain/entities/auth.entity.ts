import { roles } from "../../utils/enums/roles.enum";
import { IAuth } from "../interfaces/auth.interface";

export class Auth implements IAuth {
	password: string;
	token: string;
	role: roles;

	constructor(password: string, token: string, role: roles) {
		this.password = password;
		this.token = token;
		this.role = role;
	}
}
