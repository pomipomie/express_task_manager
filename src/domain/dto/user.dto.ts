export interface CreateParams {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface Query {
	id?: string;
	username?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	role?: string;
}
