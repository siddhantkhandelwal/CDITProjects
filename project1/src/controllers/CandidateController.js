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
        res.status(404).send({
          error: "Candidate not found"
        });
        return;
      }
      res.send(candidate);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        error: "An error has occured trying to retrieve candidate data"
      });
    }
  }
};
