const { Levels } = require("../models");
const { Exams } = require("../models");
module.exports = {
  async setData(req, res) {
    try {
      let level = await Levels.findByPk("0");
      let exam = await Exams.findByPk("0");
      if (!level || !exam) {
        return res.status(404).send({
          error: "Exam/Level not found"
        });
      }
      const result1 = await Levels.update(req.body, {
        where: {
          levelID: "0"
        },
        fields: [
          "levelIndex",
        ]
      });
      const result2 = await Exams.update(req.body, {
        where: {
          examID: "0"
        },
        fields: [
          "examName",
        ]
      });
      if (result1[0] === 0 && result2[0] === 0) {
        return res.status(404).send({
          error: "No field to be updated."
        });
      }
      // level = await Levels.findByPk("0");
      response = {};
      response.level = level;
      response.exam = exam;
      console.log(response);
      res.send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to retrieve Level/Exam data."
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
  },

  async getExamName(req, res) {
    try {
      let exam = await Exams.findByPk("0");
      if (!exam) {
        return res.status(404).send({
          error: "Exam not found"
        });
      }
      res.send(exam);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to retrieve Exam data"
      });
    }
  }
};