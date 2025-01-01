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

// mongoose
// 	// .set("bufferCommands", false)
// 	.set("debug", true)
// 	.connect(config.MONGO_URI, {
// 		dbName: "mongodb-taskmanager",
// 		tls: true,
// 		tlsAllowInvalidCertificates: true,
// 		maxPoolSize: 10,
// 	})
// 	.then(() => {
// 		logger.info("MongoDB connected successfully");
// 	})
// 	.catch((err) => {
// 		logger.error("Error connecting to MongoDB:", err);
// 		logger.debug("Full error stack:", err.stack);
// 		console.log("console.log:", err.stack);
// 	});

(async () => {
	try {
		console.log("console.log", config.MONGO_URI);
		logger.info("logger");
		await mongoose.connect(config.MONGO_URI, {
			dbName: "mongodb-taskmanager",
			tls: true,
			tlsAllowInvalidCertificates: true,
			maxPoolSize: 10,
		});
		logger.info("MongoDB connected successfully");
	} catch (err: any) {
		logger.error("Error connecting to MongoDB:", err.message);
		logger.debug("Full error stack:", err.stack);
		throw new Error("MongoDB connection failed"); // Throw error to bubble up in Netlify logs
	}
})();

export const handler = serverless(api);
