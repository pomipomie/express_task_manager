import IAuthService from "./interfaces/iauth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInput, SignupInput } from "../../domain/dto/auth.dto";
import IUserRepo from "../../domain/repositories/interfaces/iuser.repo";
import config from "../../config";

export default class AuthService implements IAuthService {
	constructor(private userRepo: IUserRepo, private jwtSecret: string) {}

	signup = async (userData: SignupInput) => {
		// Check if user already exists
		const userExists = await this.userRepo.exists(userData.username);
		if (userExists) {
			throw new Error("User already exists");
		}

		// Check if email already exists
		const emailExists = await this.userRepo.exists(userData.email);
		if (emailExists) {
			throw new Error("Email already in use");
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
			throw new Error("Email not found");
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(
			loginData.password,
			user.auth.password
		);
		if (!isPasswordValid) {
			throw new Error("Invalid email or password");
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
		// see if a setter is needed for saving token
		// maybe token should not be an auth property?

		return { token };
	};

	verifyToken = async (token: string) => {
		const decoded = jwt.verify(token, config.JWT_SECRET);
		if (!decoded) {
			throw new Error("Token not valid");
		}

		return { decoded };
	};

	logout = async (token: string) => {
		//TODO
	};
}
