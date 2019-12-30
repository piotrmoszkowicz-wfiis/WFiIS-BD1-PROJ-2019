import { Dialect } from "sequelize/types/lib/sequelize";

interface DatabaseConfig {
  engine: Dialect;
  host: string;
  maxIdleTime: number;
  maxConnections: number;
  minConnections: number;
  name: string;
  password: string;
  port: number;
  user: string;
}

interface AppConfig {
  port: number;
}

interface Config {
  database: DatabaseConfig;
  app: AppConfig;
}

export { AppConfig, Config, DatabaseConfig };
