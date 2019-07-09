const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const request = require('request-promise');
const config = require("../config/config");

function jwtSignUser(user) {
  const { id, permission_level } = user;
  const ONE_DAY = 60 * 60 * 24;
  return jwt.sign({ id, permission_level }, config.authentication.jwtSecret, {
    expiresIn: ONE_DAY
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
      const { username, password, captcha } = req.body;
      const user = await Users.findOne({
        where: {
          username: username
        }
      });
      if (!user) {
        return res.status(403).send({
          error: "The login info is incorrect"
        });
      }
      if (!user.user_status) {
        return res.status(403).send({
          error: "The user is disabled"
        });
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(403).send({
          error: "The login info was incorrect"
        });
      }
      //Secret key
      const secretKey = '6LetqqwUAAAAABpIk1y8j_QHQmSewfOs0QdsYEk3';

      //Verify URL
      const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`

      //Make request to verify URL
      const captchaVerification = await request(verifyUrl);
      const captchaVerificationJSON = JSON.parse(captchaVerification);
      if (!captchaVerificationJSON.success) {
        res.status(401).send({
          error: "Captcha verification failed"
        });
      }
      const userJson = user.toJSON();
      res.send({
        user: userJson,
        permission_level: user.permission_level,
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
