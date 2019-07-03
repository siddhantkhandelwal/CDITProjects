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
    email: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: Datatypes.TEXT,
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
    photoPtr: {
      type: Datatypes.TEXT,
      allowNull: false
    },
    /**POST-VERIFICATION DATA */
    newPhotoPtr: {
      type: Datatypes.BLOB("long")
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
