const { sequelize, Users, Candidates } = require("../src/models");

const Promise = require("bluebird");
const users = require("./users.json");
const candidates = require("./candidates.json");

sequelize.sync({ force: true }).then(async function() {
  await Promise.all(
    users.map(user => {
      Users.create(user);
    })
  );

  await Promise.all(
    candidates.map(candidate => {
      Candidates.create(candidate);
    })
  );
});
