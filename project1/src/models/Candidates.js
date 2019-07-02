module.exports = (sequelize, Datatypes) => {
  const Candidates = sequelize.define("Candidates", {
    rollNo: {
      type: Datatypes.STRING,
      primaryKey: true
    },
    name: {
      type: Datatypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: Datatypes.STRING,
      allowNull: false
    },
    mobileNo: {
      type: Datatypes.STRING, //TODO: Make it unique later
      allowNull: false
    },
    gender: {
      type: Datatypes.STRING,
      allowNull: false
    },
    /**POST-VERIFICATION DATA */
    newPhotoPtr: {
      type: Datatypes.TEXT
    },
    fingerprintOne: {
      type: Datatypes.BLOB("long")
    },
    fingerprintTwo: {
      type: Datatypes.BLOB("long")
    },
    fingerprintThree: {
      type: Datatypes.BLOB("long")
    },
    fingerprintFour: {
      type: Datatypes.BLOB("long")
    },
    thumb: {
      type: Datatypes.BLOB("long")
    }
  });
  return Candidates;
};
