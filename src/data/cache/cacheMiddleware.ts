import { Request, Response, NextFunction } from "express";
import redisClient from "./redisClient";

export const cacheMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const key = req.originalUrl; // Use the URL as the key
		const cachedData = await redisClient.get(key);

		if (cachedData) {
			console.log("Cache hit");
		} else {
			console.log("Cache miss");
		}

		next();
	} catch (error) {
		console.error("Error in cache middleware:", error);
		next();
	}
};
