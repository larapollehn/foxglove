exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required")
    .notEmpty();
  req.check("email", "Email is required")
    .notEmpty();
  req.check("email")
    .matches(/@/)
    .withMessage("Email must contain @");
  req.check("email")
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage("Email must be between 4 and 32 characters");
  req.check("password", "Password is required")
    .notEmpty();
  req.check("password")
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters.");
  req.check("password")
    .matches(/\d/)
    .withMessage("Password must contain a number");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400)
      .send(firstError);
  }
  next();
};
