import { SwaggerOptions } from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import config from "../src/config";

const swaggerOptions: SwaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Task Manager API Documentation",
			version: "1.0.0",
			description: "Express API with autogenerated Swagger documentation",
		},
		servers: [
			{
				url: config.URL,
			},
		],
	},
	apis: ["./src/api/routes/*.ts", "./src/data/models/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
