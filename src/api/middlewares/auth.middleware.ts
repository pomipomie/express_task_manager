import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../../config";
import { ClientError } from "../../utils/errors/clientError";
import { HttpStatusCode } from "../../utils/enums/httpStatusCode.enum";
import redisClient from "../../data/cache/redisClient";

export async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new ClientError(
				"Unauthorized",
				HttpStatusCode.UNAUTHORIZED,
				"Missing or invalid Authorization header"
			);
		}

		const token = req.header("Authorization")?.split(" ")[1];
		if (!token) {
			throw new ClientError(
				"Unauthorized",
				HttpStatusCode.UNAUTHORIZED,
				"Unauthorized access token"
			);
		}

		// Check Redis for blacklisted token
		const isBlacklisted = await redisClient.get(`blacklist:${token}`);
		if (isBlacklisted) {
			throw new ClientError(
				"Unauthorized",
				HttpStatusCode.UNAUTHORIZED,
				"Unauthorized access token. Token has been logged out."
			);
		}

		const decoded = jwt.verify(token, config.JWT_SECRET);
		if(!decoded) {
			throw new ClientError("Invalid token", HttpStatusCode.UNAUTHORIZED, "The token is not valid.");
		}
		(req as any).user = decoded; // Attach user info to the request
		next();
	} catch (error) {
		next(error);
	}
}
