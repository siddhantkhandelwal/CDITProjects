module.exports = (sequelize, DataTypes) => {
  const postVerification_table = sequelize.define("postVerification_table", {
    rollNo: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    newPhotoPtr: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fingerprintOne: {
      type: DataTypes.BLOB("long"),
      allowNull: false
    },
    fingerprintTwo: {
      type: DataTypes.BLOB("long"),
      allowNull: false
    },
    fingerprintThree: {
      type: DataTypes.BLOB("long"),
      allowNull: false
    },
    fingerprintFour: {
      type: DataTypes.BLOB("long"),
      allowNull: false
    },
    thumb: {
      type: DataTypes.BLOB("long"),
      allowNull: false
    },
    idType: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      default: -1
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      default: "NONE"
    }
  });

  return postVerification_table;
};
