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

//POST /auth/signup
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Bad request or validation error
 */

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

//POST /auth/login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       400:
 *         description: Bad request or validation error
 */
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
