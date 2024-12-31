import { NextFunction, Request, Response, Router } from "express";
import TaskRepo from "../../domain/repositories/task.repo";
import TaskController from "../controllers/task.controller";
import {
	createTaskValidator,
	findTaskValidator,
} from "../validators/task.validator";

const router = Router();

const taskRepository = new TaskRepo();
const taskController = new TaskController(taskRepository);

// POST /tasks/new
router.post(
	"/new",
	createTaskValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const tasks = await taskController.createTask(req, res, next);
		} catch (error) {
			res.status(500).json({ message: "error.message" });
		}
	}
);

// GET /tasks/
router.get("/", async (req: Request, res: Response) => {
	try {
		const tasks = await taskController.getAllTasks(req, res);
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

// GET /tasks/id/:id
router.get("/id/:id", async (req: Request, res: Response) => {
	try {
		const task = await taskController.getTaskById(req, res);
		res.json(task);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

// GET /tasks/find?=query
router.get("/find", findTaskValidator, async (req: Request, res: Response) => {
	try {
		console.log("/find", req.query);
		const task = await taskController.findTask(req, res);
	} catch (error) {
		res.status(404).json({
			success: false,
			message: "Task not found",
		});
	}
});

// PUT /tasks/update/:id

router.put("/update/:id", async (req: Request, res: Response) => {
	try {
		const updatedTask = await taskController.updateTask(req, res);
	} catch (error) {
		res.status(/*error.message === "Email already exists" ? 409 : */ 404).json({
			success: false,
			message:
				/*error.message || */ "An error occurred while updating the task.",
		});
	}
});

// DELETE /tasks/delete/:id
router.delete("/delete/:id", async (req: Request, res: Response) => {
	try {
		const result = await taskController.deleteTask(req, res);
	} catch (error) {
		res
			.status(/*error.message === "Incorrect credentials" ? 403 : */ 404)
			.json({
				success: false,
				message: "An error occurred while deleting the task.",
			});
	}
});

export default router;
