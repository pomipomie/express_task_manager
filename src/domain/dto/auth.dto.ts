export interface SignupInput {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface SignupOutput {
	userId: string;
	token: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface LoginOutput {
	token: string;
}
