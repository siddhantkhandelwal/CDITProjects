module.exports = (sequelize, DataTypes) => {
  const idCard_table = sequelize.define("idCard_table", {
    idType: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true
    },
    idName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idStatus: DataTypes.BOOLEAN
  });

  return idCard_table;
};
