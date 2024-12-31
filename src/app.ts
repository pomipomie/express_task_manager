import express, { Express } from "express";
import router from "./api/routes/index.router";
import config from "./config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swaggerConfig";
import mongoose from "mongoose";
import { errorHandler } from "./api/middlewares/errorHandler";
import { logger } from "./utils/logger";

const app: Express = express();

app.set("port", config.PORT);

// Middleware to parse JSON request body
app.use(express.json());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(router);

// Error handler middleware
app.use(errorHandler);

mongoose
	.connect(config.MONGO_URI)
	.then(() => {
		logger.info("MongoDB connected successfully");
	})
	.catch((err) => {
		logger.error("Error connecting to MongoDB:", err);
	});

export default app;
