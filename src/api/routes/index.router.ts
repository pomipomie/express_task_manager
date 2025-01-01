import { NextFunction, Request, Response, Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.router";
import { connection } from "mongoose";
import projectRouter from "./project.router";
import taskRouter from "./task.router";
import { APIError } from "../../utils/errors/apiError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { ClientError } from "../../utils/errors/clientError";
import redisClient from "../../data/cache/redisClient";
import { BaseError } from "../../utils/errors/baseError";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.use("/users", authenticateToken, userRouter);
router.use("/auth", authRouter);
router.use("/projects", authenticateToken, projectRouter);
router.use("/tasks", authenticateToken, taskRouter);

// test route (delete later)
/**
 * @swagger
 * /test:
 *   get:
 *     summary: Returns a message
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Express + TypeScript Server"
 */
router.use("/test", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

/**
 * @swagger
 * /db-status:
 *   get:
 *     summary: Check the database connection status
 *     responses:
 *       200:
 *         description: Database is connected
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
 *                   example: "Database is connected"
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Connection failed"
 *                 message:
 *                   type: string
 *                   example: "Database is not connected"
 */
router.use("/db-status", (req: Request, res: Response, next: NextFunction) => {
	try {
		const mongoUri = process.env.MONGO_URI;
		if (!mongoUri) {
			throw new APIError(
				"Missing Mongo URI",
				HttpStatusCode.INTERNAL_SERVER,
				"Error finding a valid Mongo URI"
			);
		}
		const isConnected = connection.readyState === 1;
		if (isConnected) {
			res
				.status(HttpStatusCode.OK)
				.json({ success: true, message: "Database is connected" });
		} else {
			throw new APIError(
				"Connection failed",
				HttpStatusCode.INTERNAL_SERVER,
				"Database is not connected"
			);
		}
	} catch (err) {
		next(err);
	}
});

//clear cache
/**
 * @swagger
 * /clearcache:
 *   post:
 *     summary: Clears all cached data in Redis
 *     responses:
 *       200:
 *         description: Cache cleared successfully
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
 *                   example: "Cache cleared"
 *       501:
 *         description: Failed to clear cache
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error clearing cache"
 *                 message:
 *                   type: string
 *                   example: "Failed to clear cache"
 */
router.use("/clearcache", async (req: Request, res: Response) => {
	try {
		await redisClient.flushAll(); // Clears all Redis data
		res
			.status(HttpStatusCode.OK)
			.json({ success: true, message: "Cache cleared" });
	} catch (error) {
		throw new BaseError(
			"Error clearing cache",
			HttpStatusCode.NOT_IMPLEMENTED,
			error?.toString() || "Failed to clear cache",
			true
		);
	}
});

// Catch-all for undefined routes
/**
 * @swagger
 * /{path*}:
 *   all:
 *     summary: Catch-all for undefined routes
 *     responses:
 *       404:
 *         description: Route not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error 404"
 *                 message:
 *                   type: string
 *                   example: "Route not found"
 */
router.use((req: Request, res: Response, next: NextFunction) => {
	throw new ClientError(
		"Error 404",
		HttpStatusCode.NOT_FOUND,
		"Route not found"
	);
});

export default router;
