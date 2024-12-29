import app from "./app";

const port: string | number = app.get("port");

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
	console.log(
		`[swagger]: Swagger docs available at http://localhost:${port}/api-docs`
	);
});
