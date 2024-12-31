import { Request, Response, Router, NextFunction } from "express";
import UserController from "../controllers/user.controller";
import UserRepo from "../../domain/repositories/user.repo";
import { IDValidator } from "../validators/common.validator";
import { findUserValidator } from "../validators/user.validator";
import { cacheMiddleware } from "../../data/cache/cacheMiddleware";

const router = Router();

const userRepository = new UserRepo();
const userController = new UserController(userRepository);

// GET /users
router.get(
	"/",
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const users = await userController.findAllUsers(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// GET /users/:id
router.get(
	"/id/:id",
	IDValidator,
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await userController.getUserById(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// GET /users/find?query
router.get(
	"/find",
	findUserValidator,
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await userController.getUser(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// PUT /users/:id
router.put(
	"/update/:id",
	IDValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await userController.updateUser(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// DELETE /users
router.delete(
	"/delete/:id",
	IDValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await userController.deleteUser(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
