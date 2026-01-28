const URL = require('../models/URL');

class redirectController {
  async redirecting(req, res) {
  try {
    const id = req.params.id;
    // ВАЖНО: убедитесь, что shortURL формируется именно так, как он лежит в БД
    const shortURL = `https://urlshortener-server-vosa.onrender.com/${id}`;
    
    const url = await URL.findOneAndUpdate(
      { shortURL },
      { $inc: { clicks: 1 } }
    );

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    let targetUrl = url.originalURL;

    // ПРОВЕРКА ПРОТОКОЛА: Если в БД нет http, добавляем его
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    console.log("req:", req);
    // Для Swagger возвращаем JSON, чтобы не было ошибки CORS
    if (req.headers['referer'] && req.headers['referer'].includes('api-docs')) {
      return res.status(200).json({ 
        message: "Success", 
        redirectto: targetUrl 
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
