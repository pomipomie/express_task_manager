import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthService from "../services/auth.service";
import { CreateParams } from "../../domain/dto/user.dto";
import { LoginInput } from "../../domain/dto/auth.dto";

const JWT_SECRET = "your_jwt_secret_key"; // Replace with a strong secret key

export default class AuthController {
	constructor(private authService: AuthService) {}

	signup = async (req: Request, res: Response) => {
		try {
			const userData: CreateParams = req.body;
			const signUp = await this.authService.signup(userData);
			if (signUp) {
				return res
					.status(201)
					.json({ message: "User registered successfully" });
			} else {
				throw new Error("Error registering");
			}
		} catch (error) {
			//TODO: manage error messsages
			// example: return res.status(400).json({ message: "User already exists" });
			console.error(error);
		}
	};

	login = async (req: Request, res: Response) => {
		try {
			const loginData: LoginInput = req.body;
			const login = await this.authService.login(loginData);
			if (login) {
				return res.status(201).json({ message: "User logged in successfully" });
			} else {
				throw new Error("Error logging in");
			}
		} catch (error) {
			//TODO: manage error messsages
			// example: return res.status(400).json({ message: "User already exists" });
			console.error(error);
		}
	};

	// see if it should be moved to middleware
	verifyToken = async (req: Request, res: Response, next: Function) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				return res.status(401).json({ message: "Unauthorized" });
			}
			const decoded = await this.authService.verifyToken(token);

			(req as any).user = decoded; // Attach user info to the request
			next();
		} catch (error) {
			return res.status(401).json({ message: "Invalid token" });
		}
	};

	//TO IMPLEMENT
	logout = async (req: Request, res: Response) => {
		try {
		} catch (error) {}
	};
}
