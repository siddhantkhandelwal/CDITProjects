const Promise = require("bluebird");
const bcrypt = Promise.promisifyAll(require("bcryptjs"));
// const bcrypt = Promise.promisifyAll(require("bcrypt-nodejs"));

function hashPassword(user, options) {
  const SALT_FACTOR = 8;
  if (!user.changed("password")) {
    return;
  }
  return bcrypt
    .genSalt(SALT_FACTOR)
    .then(salt => bcrypt.hash(user.password, salt, null))
    .then(hash => {
      user.setDataValue("password", hash);
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = (sequelize, Datatypes) => {
  const Users = sequelize.define(
    "Users",
    {
      username: {
        type: Datatypes.STRING,
        unique: true
      },
      password: Datatypes.STRING,
      permission_level: Datatypes.INTEGER,
      userStatus: Datatypes.BOOLEAN
    },
    {
      hooks: {
        // beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
        beforeSave: hashPassword
      }
    }
  );

  Users.prototype.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  return Users;
};
