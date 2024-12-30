import { Request, Response, Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthService from "../services/auth.service";
import UserRepo from "../../domain/repositories/user.repo";
import config from "../../config";

const router = Router();

const userRepository = new UserRepo();
const authService = new AuthService(userRepository, config.JWT_SECRET);
const authController = new AuthController(authService);

//POST /users/signup
router.post("/signup", async (req: Request, res: Response) => {
	try {
		const users = await authController.signup(req, res);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

//POST /users/login
router.post("/login", async (req: Request, res: Response) => {
	try {
		const users = await authController.login(req, res);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

//verify //TODO

//logout //TODO

export default router;
