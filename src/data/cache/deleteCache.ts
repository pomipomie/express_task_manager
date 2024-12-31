import redisClient from "./redisClient";

export const deleteCache = async (key: string) => {
	await redisClient.del(key);
};
