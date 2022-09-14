const URL = require("../models/URL");

class redirectController {
  async redirecting(req, res) {
    try {
      const shortURL = `http://localhost:5000/${req.params.id}`;
      const url = await URL.findOneAndUpdate(
        { shortURL },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(url.originalURL);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }
}

module.exports = new redirectController();
