import { Request, Response, Router, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";
import AuthService from "../services/auth.service";
import UserRepo from "../../domain/repositories/user.repo";
import config from "../../config";
import {
	createUserValidator,
	loginUserValidator,
} from "../validators/auth.validator";

const router = Router();

const userRepository = new UserRepo();
const authService = new AuthService(userRepository, config.JWT_SECRET);
const authController = new AuthController(authService);

//POST /users/signup
router.post(
	"/signup",
	createUserValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await authController.signup(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

//POST /users/login
router.post(
	"/login",
	loginUserValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await authController.login(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

//verify //TODO

//logout //TODO

export default router;
