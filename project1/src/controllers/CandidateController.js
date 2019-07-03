const { Candidates } = require("../models");
module.exports = {
  async createCandidate(req, res) {
    try {
      const candidate = await Candidates.create(req.body);
      const candidateJSON = candidate.toJSON();
      res.status(201).send(candidateJSON);
    } catch (err) {
      res.status(400).send({
        error: err.toString()
      });
    }
  },

  async getCandidate(req, res) {
    try {
      const candidate = await Candidates.findByPk(req.params.candidateId);
      if (!candidate) {
        return res.status(404).send({
          error: "Candidate not found"
        });
      }
      // const test = Buffer.from(JSON.stringify(candidate.fingerprintOne.data));
      // console.log(test);
      res.send(candidate);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to retrieve candidate data"
      });
    }
  },

  async updateBiometricData(req, res) {
    try {
      let candidate = await Candidates.findByPk(req.params.candidateId);
      if (!candidate) {
        return res.status(404).send({
          error: "Candidate not found"
        });
      }
      const result = await Candidates.update(req.body, {
        where: {
          rollNo: req.params.candidateId
        },
        fields: [
          "fingerprintOne",
          "fingerprintTwo",
          "fingerprintThree",
          "fingerprintFour",
          "thumb",
          "newPhotoPtr"
        ]
      });
      if (result[0] === 0) {
        return res.status(404).send({
          error: "No field to be updated."
        });
      }
      candidate = await Candidates.findByPk(req.params.candidateId);
      // res.send(candidate);
      res.send({
        message: "Successfully updated."
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to retrieve candidate data."
      });
    }
  }
};
