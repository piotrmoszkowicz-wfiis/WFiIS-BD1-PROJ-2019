import config from "config";
import { Sequelize } from "sequelize-typescript";

import Logger from "@utils/logger";

import { DatabaseConfig } from "ConfigType";

const dbConfig: DatabaseConfig = config.get("database");

const database = new Sequelize({
  database: dbConfig.name,
  dialect: dbConfig.engine,
  host: dbConfig.host,
  logging: (msg: string) => Logger.info(msg),
  modelPaths: [__dirname + "/models/*"],
  password: dbConfig.password,
  pool: {
    idle: dbConfig.maxIdleTime,
    max: dbConfig.maxConnections,
    min: dbConfig.minConnections
  },
  port: dbConfig.port,
  timezone: "+02:00",
  username: dbConfig.user
});

export default database;
