import { Request } from "express";
import redisClient from "./redisClient";

export const saveCache = async (req: Request, payload: Object | string) => {
	const key = req.originalUrl;
	await redisClient.setEx(key, 3600, JSON.stringify(payload)); // Cache for 1 hour
};
