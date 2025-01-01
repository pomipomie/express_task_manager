import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { CreateParams } from "../../domain/dto/user.dto";
import { LoginInput } from "../../domain/dto/auth.dto";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { BaseError } from "../../utils/errors/baseError";
import { ClientError } from "../../utils/errors/clientError";
import redisClient from "../../data/cache/redisClient";

export default class AuthController {
	constructor(private authService: AuthService) {}

	signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userData: CreateParams = req.body;
			const signUp = await this.authService.signup(userData);
			if (signUp) {
				return res
					.status(HttpStatusCode.CREATED)
					.json({ message: "User registered successfully" });
			} else {
				throw new BaseError(
					"Error registering user",
					HttpStatusCode.INTERNAL_SERVER,
					"User registration failed",
					true
				);
			}
		} catch (error) {
			next(error);
		}
	};

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const loginData: LoginInput = req.body;
			const login = await this.authService.login(loginData);
			if (login) {
				return res
					.status(HttpStatusCode.OK)
					.json({ message: "User logged in successfully" });
			} else {
				throw new BaseError(
					"Error logging in user",
					HttpStatusCode.INTERNAL_SERVER,
					"User login failed",
					true
				);
			}
		} catch (error) {
			next(error);
		}
	};

	// see if it should be moved to middleware
	verifyToken = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				throw new ClientError(
					"Unauthorized",
					HttpStatusCode.UNAUTHORIZED,
					"Unauthorized access token"
				);
			}
			const decoded = await this.authService.verifyToken(token);

			(req as any).user = decoded; // Attach user info to the request
			next();
		} catch (error) {
			throw new ClientError(
				`Invalid token`,
				HttpStatusCode.UNAUTHORIZED,
				`The token is not valid`
			);
		}
	};

	logout = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				throw new ClientError(
					"Missing token",
					HttpStatusCode.BAD_REQUEST,
					"No token provided"
				);
			}

			// Add the token to the blacklist
			await redisClient.set(token, "blacklisted", {
				EX: 60 * 60, // Expiration time in seconds
			}); // Expire after 1 hour or token lifetime

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Successfully logged out",
			});
		} catch (error) {
			next(error);
		}
	};
}
