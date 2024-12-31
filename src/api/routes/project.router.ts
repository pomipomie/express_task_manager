import { NextFunction, Request, Response, Router } from "express";
import ProjectRepo from "../../domain/repositories/project.repo";
import ProjectController from "../controllers/project.controller";
import {
	createProjectValidator,
	findProjectValidator,
} from "../validators/project.validator";
import { IDValidator } from "../validators/common.validator";
import { cacheMiddleware } from "../../data/cache/cacheMiddleware";

const router = Router();

const projectRepository = new ProjectRepo();
const projectController = new ProjectController(projectRepository);

// POST /projects/new
/**
 * @swagger
 * /projects/new:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Project"
 *               description:
 *                 type: string
 *                 example: "This is a new project."
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *                   example: { id: "1", title: "New Project", description: "This is a new project." }
 *       400:
 *         description: Validation error
 */
router.post(
	"/new",
	createProjectValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await projectController.createProject(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// GET /projects/
/**
 * @swagger
 * /projects/:
 *   get:
 *     summary: Retrieve all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Successfully retrieved all projects
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
 *                     example: "Project Title"
 *                   description:
 *                     type: string
 *                     example: "Project Description"
 */
router.get(
	"/",
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const projects = await projectController.getAllProjects(req, res, next);
			res.json(projects);
		} catch (error) {
			next(error);
		}
	}
);

// GET /projects/id/:id
/**
 * @swagger
 * /projects/id/{id}:
 *   get:
 *     summary: Retrieve a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the project
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
 *                   example: "Project Title"
 *                 description:
 *                   type: string
 *                   example: "Project Description"
 *       404:
 *         description: Project not found
 */

router.get(
	"/id/:id",
	IDValidator,
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await projectController.getProjectById(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// GET /projects/find?=query
/**
 * @swagger
 * /projects/find:
 *   get:
 *     summary: Find a project matching the query
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Query to search for projects
 *     responses:
 *       200:
 *         description: Successfully found the project
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
 *                   example: "Project Title"
 *                 description:
 *                   type: string
 *                   example: "Project Description"
 *       404:
 *         description: Project not found
 */
router.get(
	"/find",
	findProjectValidator,
	cacheMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await projectController.findProject(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// PUT /projects/update/:id
/**
 * @swagger
 * /projects/update/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Project Title"
 *               description:
 *                 type: string
 *                 example: "Updated Project Description"
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *                   example: { id: "1", title: "Updated Project Title", description: "Updated Project Description" }
 *       404:
 *         description: Project not found
 */
router.put(
	"/update/:id",
	IDValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await projectController.updateProject(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// DELETE /projects/delete/:id
/**
 * @swagger
 * /projects/delete/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
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
 *                   example: "Project deleted successfully"
 *       404:
 *         description: Project not found
 */
router.delete(
	"/delete/:id",
	IDValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await projectController.deleteProject(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
