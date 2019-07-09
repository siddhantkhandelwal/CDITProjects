const { sequelize, Users, Candidates, Levels, Exams } = require("../src/models");

const Promise = require("bluebird");
const users = require("./users.json");
const candidates = require("./candidates.json");
const levels = require("./levels.json");
const exams = require("./exams.json");

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

  await Promise.all(
    exams.map(exam => {
      Exams.create(exam);
    })
  );
});
