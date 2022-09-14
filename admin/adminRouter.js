const Router = require("express");
const router = new Router();
const controller = require("./adminController");
const { check } = require("express-validator");
const authMiddleware = require("../middlewaree/authMiddleware");
const schemaValidation = require("../middlewaree/schemaValidationUser");
const yup = require("yup");

router.get("/users", authMiddleware, controller.getUsers);
router.post(
  "/updateUser",
  [schemaValidation, authMiddleware],
  controller.updateUser
);
router.delete("/deleteUser", authMiddleware, controller.deleteUser);
router.get("/fetchURLsByUser", authMiddleware, controller.fetchURLsByUser);

module.exports = router;
