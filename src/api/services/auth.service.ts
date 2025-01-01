import IAuthService from "./interfaces/iauth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInput, SignupInput } from "../../domain/dto/auth.dto";
import IUserRepo from "../../domain/repositories/interfaces/iuser.repo";
import config from "../../config";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";

export default class AuthService implements IAuthService {
	constructor(private userRepo: IUserRepo, private jwtSecret: string) {}

	signup = async (userData: SignupInput) => {
		// Check if user already exists
		const userExists = await this.userRepo.exists(userData.username);
		if (userExists) {
			throw new ClientError(
				`Duplicate username`,
				HttpStatusCode.CONFLICT,
				`This username already exists`
			);
		}

		// Check if email already exists
		const emailExists = await this.userRepo.exists(userData.email);
		if (emailExists) {
			throw new ClientError(
				`Duplicate email`,
				HttpStatusCode.CONFLICT,
				`This email is already in use`
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(userData.password, 10);

		// Create user
		const user = await this.userRepo.create({
			...userData,
			password: hashedPassword,
		});

		// Generate JWT
		const token = jwt.sign({ id: user.id }, this.jwtSecret, {
			expiresIn: "1h",
		});

		// Return user id and auth token
		return { userId: user.id, token };
	};

	login = async (loginData: LoginInput) => {
		// Find user by email
		const user = await this.userRepo.findByEmail(loginData.email);
		if (!user) {
			throw new ClientError(
				`Email not found`,
				HttpStatusCode.NOT_FOUND,
				`This email does not belong to an existing user`
			);
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(
			loginData.password,
			user.auth.password
		);
		if (!isPasswordValid) {
			throw new ClientError(
				`Invalid password`,
				HttpStatusCode.BAD_REQUEST,
				`The password entered was not valid`
			);
		}

		// Generate JWT
		const token = jwt.sign(
			{ id: user.id, role: user.auth.role },
			config.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);
		user.auth.token = token;
		console.log("token", user.auth.token); // for testing purposes

		return { token };
	};

	verifyToken = async (token: string) => {
		const decoded = jwt.verify(token, config.JWT_SECRET);
		if (!decoded) {
			throw new ClientError(
				`Invalid token`,
				HttpStatusCode.UNAUTHORIZED,
				`The token is not valid`
			);
		}

		return { decoded };
	};

	logout = async (token: string) => {
		//TODO
	};
}
