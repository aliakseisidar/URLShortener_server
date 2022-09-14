const Router = require("express");
const router = new Router();
const controller = require("./redirectController");

router.get("/:id", controller.redirecting);

module.exports = router;
