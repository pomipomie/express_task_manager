import app from "./app";
import { logger } from "./utils/logger";

const port: string | number = app.get("port");

app.listen(port, () => {
	logger.info(`[server]: Server is running at http://localhost:${port}`);
	logger.info(
		`[swagger]: Swagger docs available at http://localhost:${port}/api-docs`
	);
});
