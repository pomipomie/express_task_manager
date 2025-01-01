import express, { Express } from "express";
import serverless from "serverless-http";
import { rateLimiter } from "../src/utils/rateLimiter";
import CompressionMiddleware from "../src/api/middlewares/compression.middleware";
import { swaggerSetup } from "../docs/swagger";
import router from "../src/api/routes/index.router";
import { errorHandler } from "../src/api/middlewares/errorHandler";
import mongoose from "mongoose";
import { logger } from "../src/utils/logger";
import config from "../src/config";
import cors from "cors";

const api: Express = express();

// Middleware to parse JSON request body
api.use(express.json());

// CORS configuration
const corsOptions = {
	origin: process.env.CLIENT_URL || "https://calm-trifle-c49bb1.netlify.app/",
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

api.use(cors(corsOptions));

// Compression middleware
api.use(CompressionMiddleware);

// Rate limit
api.use(rateLimiter);

api.use("/api", router);

// Swagger setup
api.use("/api/api-docs", swaggerSetup.serve, swaggerSetup.setup);

// Error handler middleware
api.use(errorHandler);

mongoose
	.connect(config.MONGO_URI)
	.then(() => {
		logger.info("MongoDB connected successfully");
	})
	.catch((err) => {
		logger.error("Error connecting to MongoDB:", err);
	});

export const handler = serverless(api);
