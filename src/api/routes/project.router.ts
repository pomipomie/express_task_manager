import { NextFunction, Request, Response, Router } from "express";
import ProjectRepo from "../../domain/repositories/project.repo";
import ProjectController from "../controllers/project.controller";
import {
	createProjectValidator,
	findProjectValidator,
} from "../validators/project.validator";
import { IDValidator } from "../validators/common.validator";

const router = Router();

const projectRepository = new ProjectRepo();
const projectController = new ProjectController(projectRepository);

// POST /projects/new
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
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const projects = await projectController.getAllProjects(req, res, next);
		res.json(projects);
	} catch (error) {
		next(error);
	}
});

// GET /projects/id/:id
router.get(
	"/id/:id",
	IDValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await projectController.getProjectById(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// GET /projects/find?=query
router.get(
	"/find",
	findProjectValidator,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await projectController.findProject(req, res, next);
		} catch (error) {
			next(error);
		}
	}
);

// PUT /projects/update/:id

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
