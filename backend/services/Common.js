const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  //TODO : this is temporary token for testing without cookie
  // token =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTQyZTQ3NzVhMDcwZjcwNmZkYTJhZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNjg3OTg5OX0.LYmtUO8vImrnoRYDT0RvqPThq4HRngR9t03Uuf6XfeY";
  return token;
};
