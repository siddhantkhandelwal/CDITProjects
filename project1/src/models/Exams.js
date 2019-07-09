module.exports = (sequelize, Datatypes) => {
    const Exams = sequelize.define("Exams", {
      examID: {
        type: Datatypes.STRING,
        primaryKey: true
      },
      examName: {
        type: Datatypes.STRING,
      },
    });
    return Exams;
  };
  