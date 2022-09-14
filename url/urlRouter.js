const Router = require("express");
const router = new Router();
const { check } = require("express-validator");
const controller = require("./urlController");
const authMiddleware = require("../middlewaree/authMiddleware");

router.post(
  "/shortURL",
  [
    check("originalURL", "URL should be less than 2048 symbols").isLength({
      max: 2048,
    }),
    check("originalURL", "Non-URL provided").isURL(),
    authMiddleware,
  ],
  controller.shortURL
);
router.get("/fetchURLs", authMiddleware, controller.fetchURLs);
router.get("/fetchURL", authMiddleware, controller.fetchURL);
router.get("/searchURLs", authMiddleware, controller.searchURLs);
router.delete("/deleteURL", authMiddleware, controller.deleteURL);
router.post("/updateTags", authMiddleware, controller.updateTags);

module.exports = router;
