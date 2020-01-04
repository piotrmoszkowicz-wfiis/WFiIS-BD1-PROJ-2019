import "reflect-metadata";

import config from "config";
import { createExpressServer } from "routing-controllers";

import database from "./database";
import AuthMiddleware from "@middlewares/AuthMiddleware";
import logger from "@utils/logger";
import runTriggers from "@utils/runTriggers";

const controllers =
  config.get<string>("app.env") === "dev"
    ? [__dirname + "/controllers/*.ts"]
    : [__dirname + "/controllers/*.js"];

const app = createExpressServer({
  cors: true,
  controllers,
  middlewares: [AuthMiddleware],
  routePrefix: "/api"
});

const port: number = config.get("app.port");

app.listen(port, async () => {
  try {
    await database.sync({ force: false });
    runTriggers();
    logger.log("info", `App is running at :${port} in ${app.get("env")} mode`);
    logger.log("info", "Press CTRL-C to stop\n");
  } catch (err) {
    logger.log("error", "Error with database", { err });
  }
});
