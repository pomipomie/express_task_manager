import { NextFunction, Request, Response, Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.router";
import { connection } from "mongoose";
import projectRouter from "./project.router";
// import authorization and response messsages

// bring routers here

const router = Router();

// verify authorization

// router.use("/route", routeRouter)
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/projects", projectRouter);

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
			res.status(200).json({ success: true, message: "Database is connected" });
		} else {
			res
				.status(500)
				.json({ success: false, message: "Database is not connected" });
		}
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ success: false, message: "Error checking database status" });
	}
});

// Catch-all for undefined routes
router.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

export default router;
