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
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve all users
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
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
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 */

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
/**
 * @swagger
 * /users/id/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       404:
 *         description: User not found
 */
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
/**
 * @swagger
 * /users/find:
 *   get:
 *     tags: [Users]
 *     summary: Find a user by query
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "name=John"
 *         description: Query to find users
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       404:
 *         description: User not found
 */
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
/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
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
/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
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
