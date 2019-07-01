const AuthenticationController = require("./controllers/AuthenticationController");
const CandidateController = require("./controllers/CandidateController");
module.exports = app => {
  app.post("/api/register", AuthenticationController.register);
  app.post("/api/login", AuthenticationController.login);
  app.post("/api/candidates", CandidateController.createCandidate);
  app.get("/api/candidates/:candidateId", CandidateController.getCandidate); //Here candidate-id is rollNo
  // app.update("");
};
