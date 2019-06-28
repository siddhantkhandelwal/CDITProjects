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
      unique: true,
      allowNull: false
    },
    fingerprintOne: {
      type: DataTypes.LONGBLOB,
      allowNull: false
    },
    fingerprintTwo: {
      type: DataTypes.LONGBLOB,
      allowNull: false
    },
    fingerprintThree: {
      type: DataTypes.LONGBLOB,
      allowNull: false
    },
    fingerprintFour: {
      type: DataTypes.LONGBLOB,
      allowNull: false
    },
    thumb: {
      type: DataTypes.LONGBLOB,
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
};
