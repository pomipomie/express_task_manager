import express, { Express } from "express";
import router from "./api/routes/index.routes";
import config from "./config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swaggerConfig";

const app: Express = express();

app.set("port", config.PORT);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(router);

export default app;
