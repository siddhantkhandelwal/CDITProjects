const AuthenticationController = require("./controllers/AuthenticationController");
const CandidateController = require("./controllers/CandidateController");
const CandidateControllerPolicy = require("./policies/CandidateControllerPolicy");

const isAuthenticated = require("./policies/isAuthenticated");
module.exports = app => {
  app.post("/api/register", AuthenticationController.register);
  app.post("/api/login", AuthenticationController.login);
  app.post("/api/candidates", CandidateController.createCandidate);
  app.get(
    "/api/candidates/:candidateId",
    isAuthenticated,
    CandidateController.getCandidate
  ); //Here candidate-id is rollNo
  app.post(
    "/api/candidates/:candidateId/update-biometric",
    isAuthenticated,
    CandidateControllerPolicy.updateBiometricData,
    CandidateController.updateBiometricData
  );
};
