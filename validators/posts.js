const { check, validationResult } = require("express-validator");

const validatorCreatePost = [
  check("title").exists().notEmpty().isLength({ min: 3, max: 124 }),
  (req, res, next) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
      res.status(400).json({ errors: err.array() });
    }
  },
];
module.exports = { validatorCreatePost };
