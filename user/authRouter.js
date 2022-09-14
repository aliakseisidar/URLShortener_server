const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");

router.post(
  "/registration",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("username", "Email should be provided in Username").isEmail(),
    check("password", "Password should be 6 symbols or more").isLength({
      min: 6,
    }),
    check("password", "Password should be less than 100 symbols").isLength({
      max: 100,
    }),
  ],
  controller.registration
);
router.post(
  "/login",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("username", "Email should be provided in Username").isEmail(),
    check("password", "Password should be 6 symbols or more").isLength({
      min: 6,
    }),
    check("password", "Password should be less than 100 symbols").isLength({
      max: 100,
    }),
  ],
  controller.login
);

module.exports = router;
