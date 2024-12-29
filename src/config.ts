import { config } from "dotenv";

config();

export default {
	PORT: process.env.PORT || 3000,
	MONGO_URI: process.env.MONGODB_URI || "",
	ENV: process.env.NODE_ENV || "development",
	URL: process.env.URL,
};
