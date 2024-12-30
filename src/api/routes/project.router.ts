import { Request, Response, Router } from "express";
// import UserController from "../controllers/user.controller";
// import UserRepo from "../../domain/repositories/user.repo";
import ProjectRepo from "../../domain/repositories/project.repo";
import ProjectController from "../controllers/project.controller";
//import validators and auth

const router = Router();

const projectRepository = new ProjectRepo();
const projectController = new ProjectController(projectRepository);

// POST /projects/new
router.post("/new", async (req: Request, res: Response) => {
	try {
		const projects = await projectController.createProject(req, res);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

// GET /projects/
router.get("/", async (req: Request, res: Response) => {
	try {
		const projects = await projectController.getAllProjects(req, res);
		res.json(projects);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

// GET /projects/id/:id
router.get("/id/:id", async (req: Request, res: Response) => {
	try {
		const project = await projectController.getProjectById(req, res);
		res.json(project);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

// GET /projects/find?=query
router.get("/find", async (req: Request, res: Response) => {
	try {
		console.log("/find", req.query);
		const project = await projectController.findProject(req, res);
	} catch (error) {
		res.status(404).json({
			success: false,
			message: "Project not found",
		});
	}
});

// PUT /projects/update/:id

router.put("/update/:id", async (req: Request, res: Response) => {
	try {
		const updatedProject = await projectController.updateProject(req, res);
	} catch (error) {
		res.status(/*error.message === "Email already exists" ? 409 : */ 404).json({
			success: false,
			message:
				/*error.message || */ "An error occurred while updating the project.",
		});
	}
});

// DELETE /projects/delete/:id
router.delete("/delete/:id", async (req: Request, res: Response) => {
	try {
		const result = await projectController.deleteProject(req, res);
	} catch (error) {
		res
			.status(/*error.message === "Incorrect credentials" ? 403 : */ 404)
			.json({
				success: false,
				message: "An error occurred while deleting the project.",
			});
	}
});

export default router;
