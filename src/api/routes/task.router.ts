import { NextFunction, Request, Response, Router } from "express";
import TaskRepo from "../../domain/repositories/task.repo";
import TaskController from "../controllers/task.controller";
import {
	createTaskValidator,
	findTaskValidator,
} from "../validators/task.validator";
import { IDValidator } from "../validators/common.validator";
import { cacheMiddleware } from "../../data/cache/cacheMiddleware";

const router = Router();

const taskRepository = new TaskRepo();
const taskController = new TaskController(taskRepository);

// POST /tasks/new
router.post(
	"/new",
	createTaskValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await taskController.createTask(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// GET /tasks/
router.get(
	"/",
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const tasks = await taskController.getAllTasks(req, res, next);
			res.json(tasks);
		} catch (error) {
			next(error);
		}
	}
);

// GET /tasks/id/:id
router.get(
	"/id/:id",
	IDValidator,
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await taskController.getTaskById(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// GET /tasks/find?=query
router.get(
	"/find",
	findTaskValidator,
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await taskController.findTask(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// PUT /tasks/update/:id

router.put(
	"/update/:id",
	IDValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await taskController.updateTask(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// DELETE /tasks/delete/:id
router.delete(
	"/delete/:id",
	IDValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await taskController.deleteTask(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
