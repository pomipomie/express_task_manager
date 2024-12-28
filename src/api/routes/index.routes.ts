import { Request, Response, Router } from "express";
// import authorization and response messsages

// bring routers here

const router = Router();

// verify authorization

// router.use("/route", routeRouter)

// test route (delete later)
router.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

// not found route
router.use((req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: "not found", //insert error message
	});
});

export default router;
