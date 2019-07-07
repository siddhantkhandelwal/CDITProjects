const AuthenticationController = require("./controllers/AuthenticationController");
const CandidateController = require("./controllers/CandidateController");
const CandidateControllerPolicy = require("./policies/CandidateControllerPolicy");
const AdminController = require("./controllers/AdminController");

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
  app.post("/api/level", AdminController.switchLevel);
  app.post('/api/getLevel', AdminController.getLevel);
};
