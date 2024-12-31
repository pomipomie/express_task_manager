import { createClient } from "redis";
import config from "../../config";
import { logger } from "../../utils/logger";

const redisClient = createClient({
	url: config.REDIS_URI,
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

(async () => {
	const connected = await redisClient.connect();
	if (connected) logger.info("Redis Connected Successfully");
})();

export default redisClient;
