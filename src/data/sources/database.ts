import { connect, connection } from "mongoose";
import config from "../../config";

// (async () => {
// 	try {
// 		const db = await connect(config.MONGO_URI);
// 		console.log("[database] Database connected to", db.connection.name);
// 	} catch (error) {
// 		console.error(error);
// 	}
// })();

const connectToDatabase = async () => {
	try {
		await connect(config.MONGO_URI);
		console.log("Database connected successfully");

		// Listen for connection events
		connection.on("connected", () => {
			console.log("Mongoose connected to the database");
		});

		connection.on("error", (err) => {
			console.error("Mongoose connection error:", err);
		});

		connection.on("disconnected", () => {
			console.log("Mongoose disconnected");
		});
	} catch (error) {
		console.error("Database connection failed:", error);
		process.exit(1); // Exit the application
	}
};

connectToDatabase();
