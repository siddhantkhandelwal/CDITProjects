const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  });
}

module.exports = {
  async register(req, res) {
    try {
      const user = await Users.create(req.body);
      const userJson = user.toJSON();
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      });
    } catch (err) {
      res.status(400).send({
        error: err.toString()
      });
    }
  },
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({
        where: {
          username: username
        }
      });
      if (!user) {
        return res.status(403).send({
          error: "The login info was incorrect"
        });
      }
      const isPasswordValid = await user.comparePassword(password);
      console.log(isPasswordValid);
      if (!isPasswordValid) {
        return res.status(403).send({
          error: "The login info was incorrect"
        });
      }

      const userJson = user.toJSON();
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to log in."
      });
    }
  }
};
