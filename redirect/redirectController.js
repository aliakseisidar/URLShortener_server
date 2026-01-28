const URL = require('../models/URL');

class redirectController {
  async redirecting(req, res) {
    // #swagger.tags = ['Redirect']
    // #swagger.summary = 'Перенаправление'
    /* #swagger.responses[302] = {
      description: 'Перенаправление на оригинальный URL',
      headers: {
        Location: {
          description: 'URL для перехода',
          type: 'string'
        }
      }
  } */
    try {
      const shortURL = `https://urlshortener-server-vosa.onrender.com/${req.params.id}`;
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
