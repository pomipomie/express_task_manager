import { Request, Response, Router } from "express";
import UserController from "../controllers/user.controller";
import UserRepo from "../../domain/repositories/user.repo";
//import validators and auth

const router = Router();

const userRepository = new UserRepo();
const userController = new UserController(userRepository);

// GET /users
router.get("/", async (req: Request, res: Response) => {
	try {
		const users = await userController.findAllUsers(req, res);
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

// GET /users/:id
router.get("/id/:id", async (req: Request, res: Response) => {
	try {
		const users = await userController.getUserById(req, res);
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "error.message" });
	}
});

// GET /users/find?query
router.get("/find", async (req: Request, res: Response) => {
	try {
		console.log("/find", req.query);
		const user = await userController.getUser(req, res);
	} catch (error) {
		res.status(404).json({
			success: false,
			message: "User not found",
		});
	}
});

// PUT /users/:id
router.put("/update/:id", async (req: Request, res: Response) => {
	try {
		const updatedUser = await userController.updateUser(req, res);
	} catch (error) {
		res.status(/*error.message === "Email already exists" ? 409 : */ 404).json({
			success: false,
			message:
				/*error.message || */ "An error occurred while updating the user.",
		});
	}
});

// DELETE /users
router.delete("/delete/:id", async (req: Request, res: Response) => {
	try {
		const result = await userController.deleteUser(req, res);
	} catch (error) {
		res
			.status(/*error.message === "Incorrect credentials" ? 403 : */ 404)
			.json({
				success: false,
				message: "An error occurred while deleting the user.",
			});
	}
});

export default router;
