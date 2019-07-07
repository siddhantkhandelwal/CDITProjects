module.exports = (sequelize, Datatypes) => {
  const Levels = sequelize.define("Levels", {
    levelID: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    levelIndex: {
      type: Datatypes.STRING,
    },
  });
  return Levels;
};
