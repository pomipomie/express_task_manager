import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";

const swaggerOptions = {
	swaggerOptions: {
		persistAuthorization: true,
	},
};

export const swaggerSetup = {
	serve: swaggerUi.serve,
	setup: swaggerUi.setup(swaggerSpec, swaggerOptions),
};
