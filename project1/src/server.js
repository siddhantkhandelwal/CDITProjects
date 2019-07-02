const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config/config");
const path = require("path");

const app = express();

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

require("./passport");
require("./routes")(app);

//{force: true}
sequelize.sync().then(() => {
  app.listen(config.port, () =>
    console.log(`App listening on port ${config.port}`)
  );
});
