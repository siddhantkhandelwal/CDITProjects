const { Levels } = require("../models");
module.exports = {
  async switchLevel(req, res) {
    try {
      let level = await Levels.findByPk("0");
      if (!level) {
        return res.status(404).send({
          error: "Level not found"
        });
      }
      if (level.levelIndex == 1) {
        levelIndex = 2;
      }
      else {
        levelIndex = 1;
      }
      const result = await Levels.update(req.body, {
        where: {
          levelID: "0"
        },
        fields: [
          "levelIndex",
        ]
      });
      if (result[0] === 0) {
        return res.status(404).send({
          error: "No field to be updated."
        });
      }
      // level = await Levels.findByPk("0");
      res.send(level);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to retrieve Level data."
      });
    }
  },

  async getLevel(req, res) {
    try {
      let level = await Levels.findByPk("0");
      console.log(level)
      if (!level) {
        return res.status(404).send({
          error: "Level not found"
        });
      }
      res.send(level);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to retrieve Level data"
      });
    }
  }
};