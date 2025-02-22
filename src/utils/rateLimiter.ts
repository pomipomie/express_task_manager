import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
	standardHeaders: true, // add the `RateLimit-*` headers to the response
	legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
	keyGenerator: (req) => {
		const forwarded = req.headers["x-forwarded-for"];
		return (
			(Array.isArray(forwarded) ? forwarded[0] : forwarded) || req.ip || ""
		);
	},
});
