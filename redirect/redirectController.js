const URL = require('../models/URL');

class redirectController {
async redirecting(req, res) {
    try {
        const shortURL = `https://urlshortener-server-vosa.onrender.com/${req.params.id}`;
        const url = await URL.findOneAndUpdate(
            { shortURL },
            { $inc: { clicks: 1 } },
        );

        if (!url) return res.status(404).json({ message: "URL not found" });

        // ХАК: Если запрос пришел из Swagger (или это AJAX-запрос)
        // Мы отдаем JSON, а если из адресной строки браузера — делаем редирект
        if (req.headers['sec-fetch-mode'] === 'cors' || req.headers.accept.includes('application/json')) {
            return res.status(302).json({ 
                message: "Success", 
                redirectToUrl: url.originalURL 
            });
        }

    // Для обычных пользователей делаем редирект
    return res.redirect(targetUrl);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
}

module.exports = new redirectController();
