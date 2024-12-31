import { NextFunction, Request, Response, Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.router";
import { connection } from "mongoose";
import projectRouter from "./project.router";
import taskRouter from "./task.router";
import { APIError } from "../../utils/errors/apiError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import { ClientError } from "../../utils/errors/clientError";
// import authorization and response messsages

const router = Router();

// verify authorization

// router.use("/route", routeRouter)
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/tasks", taskRouter);

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

router.use("/db-status", (req: Request, res: Response, next: NextFunction) => {
	try {
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
		throw new APIError(
			"Connection failed",
			HttpStatusCode.INTERNAL_SERVER,
			"Error checking database connection"
		);
	}
});

// Catch-all for undefined routes
router.use((req: Request, res: Response, next: NextFunction) => {
	throw new ClientError(
		"Error 404",
		HttpStatusCode.NOT_FOUND,
		"Route not found"
	);
});

export default router;
