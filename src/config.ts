import { config } from "dotenv";

config();

export default {
	PORT: process.env.PORT || 3000,
	MONGO_URI: process.env.MONGO_URI || "",
	ENV: process.env.NODE_ENV || "development",
	URL: process.env.URL || "",
	CLIENT_URL: process.env.CLIENT_URL || "",
	JWT_SECRET: process.env.JWT_SECRET || "246789",
	REDIS_URI: process.env.REDIS_URI,
};
