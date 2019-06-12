const express = require("express");
const bodyParser = require("body-parser");
const faker = require("faker");
const times = require("lodash.times");
const random = require("lodash.random");
const db = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(express.static("app/public"));

app.listen(8000, () => console.log("App listening on port 8000!"));