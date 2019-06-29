module.exports = (sequelize, DataTypes) => {
  const adminUsers_table = sequelize.define("adminUsers_table", {
    userNo: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permissionLevel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userStatus: DataTypes.BOOLEAN
  });
};
