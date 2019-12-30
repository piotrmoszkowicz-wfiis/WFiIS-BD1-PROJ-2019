module.exports = {
  database: {
    engine: "postgres",
    host: "127.0.0.1",
    maxConnections: 25,
    maxIdleTime: 30000,
    minConnections: 0,
    name: "",
    password: "",
    port: 5432,
    user: ""
  },
  app: {
    port: 4000,
    env: "dev",
    saltRounds: 10,
    jwtKey: ""
  }
};
