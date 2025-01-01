import express, { Express } from "express";
import router from "./api/routes/index.router";
import config from "./config";
import { swaggerSetup } from "../docs/swagger";
import mongoose from "mongoose";
import { errorHandler } from "./api/middlewares/errorHandler";
import { logger } from "./utils/logger";
import { rateLimiter } from "./utils/rateLimiter";
import CompressionMiddleware from "./api/middlewares/compression.middleware";

const app: Express = express();

app.set("port", config.PORT);

// Middleware to parse JSON request body
app.use(express.json());

// Rate limit
app.use(rateLimiter);

// Compression middleware
app.use(CompressionMiddleware);

// Swagger setup
app.use("/api-docs", swaggerSetup.serve, swaggerSetup.setup);

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
