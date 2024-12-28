import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./api/routes/index.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(router);
