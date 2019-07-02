const path = require("path");
module.exports = {
  port: process.env.PORT || 8000,
  db: {
    database: process.env.DB_NAME || "project1",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    options: {
      dialect: process.env.DIALECT || "sqlite",
      host: process.env.HOST || "localhost",
      storage: path.resolve(__dirname, "../../cdit-project1.sqlite")
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || "plkuijre" //random secret
  }
};
