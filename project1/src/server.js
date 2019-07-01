const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config/config");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("app/public"));

require("./passport");

require("./routes")(app);
//{force: true}
sequelize.sync().then(() => {
  app.listen(config.port, () =>
    console.log(`App listening on port ${config.port}`)
  );
});
