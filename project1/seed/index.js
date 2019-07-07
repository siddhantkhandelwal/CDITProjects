const { sequelize, Users, Candidates, Levels } = require("../src/models");

const Promise = require("bluebird");
const users = require("./users.json");
const candidates = require("./candidates.json");
const levels = require("./levels.json")

sequelize.sync({ force: true }).then(async function () {
  await Promise.all(
    users.map(user => {
      Users.create(user);
    })
  );

  await Promise.all(
    levels.map(level => {
      Levels.create(level);
    })
  );

  await Promise.all(
    candidates.map(candidate => {
      Candidates.create(candidate);
    })
  );
});
