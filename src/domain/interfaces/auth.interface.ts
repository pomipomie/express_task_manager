import { roles } from "../../utils/enums/roles.enum";

export interface IAuth {
	password: string;
	token: string;
	role: roles;
}
