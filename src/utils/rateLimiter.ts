import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const rateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
	standardHeaders: true, // add the `RateLimit-*` headers to the response
	legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
	keyGenerator: (req) => {
		// Use API key (or some other identifier) for authenticated users
 		if (req.query.apiKey) return req.query.apiKey as string;

 		// fallback to IP for unauthenticated users
		return ipKeyGenerator(req.ip as string) // better
	},
});
