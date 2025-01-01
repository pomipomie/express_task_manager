import { Request, Response, Router, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";
import AuthService from "../services/auth.service";
import UserRepo from "../../domain/repositories/user.repo";
import config from "../../config";
import {
	createUserValidator,
	loginUserValidator,
} from "../validators/auth.validator";
import { authenticateToken } from "../middlewares/auth.middleware";

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
 *               firstName:
 *                 type: string
 *                 example: "john"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               password:
 *                 type: string
 *                 example: "Securepassword1!"
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

//logout
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out the user by invalidating the JWT token.
 *     description: This endpoint logs the user out by invalidating their JWT token by blacklisting the token.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out. The token is invalidated.
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
 *                   example: "Logged out successfully."
 *       401:
 *         description: Unauthorized. The request did not contain a valid JWT token or the token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access Denied. Token Missing."
 *       500:
 *         description: Internal server error. An unexpected error occurred during logout processing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error processing logout."
 */

router.post(
	"/logout",
	authenticateToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await authController.logout(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
