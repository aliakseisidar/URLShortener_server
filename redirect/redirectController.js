const URL = require("../models/URL");
const { baseURL } = require("../config")

class redirectController {
  async redirecting(req, res) {
    // #swagger.tags = ['Redirect']
    // #swagger.summary = 'Перенаправление'
    try {
      const shortURL = `${baseURL}/${req.params.id}`;
      const url = await URL.findOneAndUpdate(
        { shortURL },
        { $inc: { clicks: 1 } },
      );
      return res.redirect(url.originalURL);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error' });
    }
  }
}

module.exports = new redirectController();
