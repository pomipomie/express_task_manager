import { Request, Response, NextFunction } from "express";
import redisClient from "./redisClient";
import { logger } from "../../utils/logger";

export const cacheMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const key = req.originalUrl; // Use the URL as the key
		const cachedData = await redisClient.get(key);

		if (cachedData) {
			logger.info("Cache hit");
		} else {
			logger.info("Cache miss");
		}

		next();
	} catch (error) {
		logger.error("Error in cache middleware:", error);
		next();
	}
};
