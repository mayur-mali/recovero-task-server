var passport = require("passport");
const userModal = require("../modals/user");

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    userModal.findById(jwt_payload.userId, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

passport.deserializeUser(function (id, done) {
  userModel.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
});

// checking authentication of user it is a middleware
passport.checkAuthenticationUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  next("unauthorized");
};

//setting authentication so to use in our local view

passport.isAdmin = function (req, res, next) {
  if (req.isAuthenticated()) {
    req.isAdmin = req.user.role == "admin";
  }
  return next();
};
