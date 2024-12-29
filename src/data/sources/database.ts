import { connect } from "mongoose";
import config from "../../config";

(async () => {
	try {
		const db = await connect(config.MONGO_URI);
		console.log("Database connected to", db.connection.name);
	} catch (error) {
		console.error(error);
	}
})();
