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
/**
 * @swagger
 * /tasks/new:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Task"
 *               description:
 *                 type: string
 *                 example: "This is a new task."
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task:
 *                   type: object
 *                   example: { id: "1", title: "New Task", description: "This is a new task." }
 *       400:
 *         description: Validation error
 */

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
/**
 * @swagger
 * /tasks/:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   title:
 *                     type: string
 *                     example: "Task Title"
 *                   description:
 *                     type: string
 *                     example: "Task Description"
 */

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
/**
 * @swagger
 * /tasks/id/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 title:
 *                   type: string
 *                   example: "Task Title"
 *                 description:
 *                   type: string
 *                   example: "Task Description"
 *       404:
 *         description: Task not found
 */

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
/**
 * @swagger
 * /tasks/find:
 *   get:
 *     summary: Find a task matching the query
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Query to search for tasks
 *     responses:
 *       200:
 *         description: Successfully found the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 title:
 *                   type: string
 *                   example: "Task Title"
 *                 description:
 *                   type: string
 *                   example: "Task Description"
 *       404:
 *         description: Task not found
 */

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

// GET /tasks/findmany?=query
/**
 * @swagger
 * /tasks/findmany:
 *   get:
 *     summary: Find multiple tasks matching the query
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Query to search for tasks
 *     responses:
 *       200:
 *         description: Successfully found tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   title:
 *                     type: string
 *                     example: "Task Title"
 *                   description:
 *                     type: string
 *                     example: "Task Description"
 *       404:
 *         description: No tasks found
 */

router.get(
	"/findmany",
	findTaskValidator,
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await taskController.findManyTasks(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// PUT /tasks/update/:id
/**
 * @swagger
 * /tasks/update/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Task Title"
 *               description:
 *                 type: string
 *                 example: "Updated Task Description"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 task:
 *                   type: object
 *                   example: { id: "1", title: "Updated Task Title", description: "Updated Task Description" }
 *       404:
 *         description: Task not found
 */

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
/**
 * @swagger
 * /tasks/delete/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
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
 *                   example: "Task deleted successfully"
 *       404:
 *         description: Task not found
 */

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
