const { check, validationResult } = require("express-validator");
const createUser = [
  check("fullName") //capturamos el campo y luego ponemos las validaciones
    .trim()
    .notEmpty()
    .withMessage("El campo no puede estar vacio")
    .isAlpha("es-ES", { ignore: " " }) 
    .withMessage("Solo letras")
    .isLength({ min: 5, max: 90 })
    .withMessage("El nombre debe tener: min 5, max 90"),
  check("userName").trim().notEmpty().withMessage("El campo no puede estar vacio"), //capturamos el campo
  check("email")//capturamos el campo
    .trim()
    .notEmpty()
    .withMessage("El campo no puede estar vacio")
    .isEmail()
    .withMessage("Ingrese un correo valido")
    .normalizeEmail(),
  check("password")//capturamos el campo
    .trim()
    .notEmpty()
    .withMessage("El campo no puede estar vacio")
    .isLength({ min: 8, max: 16 })
    .withMessage("La contraseña debe tener: min 8, max 16"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    } else {
      return next();
    }
  },
];

const resetPassword = [
  check("password_1")
    .exists()
    .isLength({ min: 8, max: 16 })
    .withMessage("Between 8 and 16 characters")
    .trim(),
  check("password_2").custom(async (password_2, { req }) => {
    if (req.body.password_1 !== password_2) {
      throw new Error("Passwords must be identical");
    }
  }),
  (req, res, next) => {
    const token = req.params.token;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const arrWarnings = errors.array();
      res.render("reset", { arrWarnings, token });
    } else {
      return next();
    }
  },
];
module.exports = { createUser, resetPassword };
