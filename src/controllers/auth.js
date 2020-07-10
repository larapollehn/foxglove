const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");

const Auth = require("../models/user");
const log = require("../utils/Logger");

const JWT_SECRET = process.env.JWT_SECRET || "ifdjsaihidshgo";

exports.signup = (req, res) => {
  const user = new Auth(req.body);
  log.debug("User signed up:", user);
  user.save((err, singInUser) => {
    if (err) {
      return res.status(400)
        .json({ error: err.message });
    }
    // salt and password should not be in response, fe doesnt need to know
    // set to undefined before sending the user as response
    singInUser.salt = undefined;
    singInUser.hashed_password = undefined;
    res.json({ singInUser });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  log.debug("User tries to sign in:", email);
  // search for user based on email address
  Auth.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400)
        .json({
          error: "Auth with that email does not exist. Please signup",
        });
    }
    if (!user.authenticate(password)) {
      return res.status(401)
        .json({
          error: "Email and password dont match",
        });
    }
    // create and sign jwt, payload is userId, store as cookie
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    const {
      _id, name, email, role,
    } = user;
    return res.json({
      token,
      user: {
        _id,
        email,
        name,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  log.debug("User signed out and token in cookie is cleared");
  res.clearCookie("t");
  res.json({ message: "Auth signed out" });
};

// Middleware

exports.requireSignin = expressJWT({
  secret: JWT_SECRET,
  algorithms: ["SHA1"],
  userProperty: "auth",
});

/**
 * checks is user is authenticated and profile matches authenticated user is
 */
exports.isAuth = (req, res, next) => {
  const user = req.profile && req.auth && req.profile._id == req.auth._id;
  log.debug("User needs to be authenticated:", user);
  if (!user) {
    return res.status(403)
      .json({
        error: "Access denied",
      });
  }
  next();
};

/**
 * Middleware to verify that a users role is admin,
 * since certain actions can only be performed of user with role 1
 */
exports.isAdmin = (req, res, next) => {
  log.debug("Check if user has admin role");
  if (req.profile.role === 0) {
    return res.status(403)
      .json({
        error: "Admin resource. Access denied.",
      });
  }
  next();
};
