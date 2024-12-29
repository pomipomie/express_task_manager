import express, { Express } from "express";
import router from "./api/routes/index.routes";
import config from "./config";

const app: Express = express();

app.set("port", config.PORT);

app.use(router);

export default app;
