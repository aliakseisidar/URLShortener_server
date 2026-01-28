const URL = require("../models/URL");
const { validationResult } = require("express-validator");
const { baseURL } = require("../config")

const shortURLgenerator = () => {
  return `${(Math.random() + 1).toString(36).substring(7)}`;
};

class urlController {
  async shortURL(req, res) {
    // #swagger.tags = ['URLs']
    // #swagger.summary = 'Создать короткую ссылку'
    // #swagger.security = [{ "bearerAuth": [] }]
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'The error occurred', errors });
      }

      const { originalURL, title, tags } = req.body;
      const path = shortURLgenerator();

      const isAlot = await URL.countDocuments();
      if (isAlot > 10000) {
        return res
          .status(500)
          .json({ message: `Shorting is temporarily disabled` });
      }

      const count = await URL.countDocuments({ userId: req.user.id });
      if (count > 50) {
        return res
          .status(500)
          .json({ message: `You can't have more than 50 short links.` });
      }

      const url = new URL({
        title,
        originalURL,
        shortURL: `${baseURL}/${path}`,
        path,
        createdAt: new Date().toISOString(),
        userId: req.user.id,
        tags,
      });
      await url.save();
      return res.json({ message: 'URL created succesfully', URL: url });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error' });
    }
  }

  async fetchURLs(req, res) {
    // #swagger.tags = ['URLs']
    // #swagger.summary = 'Получить все короткие ссылки пользователя'
    // #swagger.security = [{ "bearerAuth": [] }]
    try {
      const { offset, limit } = req.headers;
      const urls = await URL.find({ userId: req.user.id })
        .sort({ createdAt: 'asc' })
        .limit(limit)
        .skip(offset);
      const count = await URL.countDocuments({ userId: req.user.id });
      return res.json({ links: urls, count });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error' });
    }
  }

  async searchURLs(req, res) {
    // #swagger.tags = ['URLs']
    // #swagger.summary = 'Поиск коротких ссылок пользователя'
    // #swagger.security = [{ "bearerAuth": [] }]
    try {
      /*    const user = {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      }; */
      const { offset, limit, tagsearchparam, titlesearchparam } = req.headers;
      const urls = await URL.find({ userId: req.user.id })
        .or([
          { title: { $regex: titlesearchparam, $options: 'i' } },
          { tags: { $in: [tagsearchparam] } },
        ])
        .sort({ createdAt: 'asc' })
        .limit(limit)
        .skip(offset);
      const count = await URL.countDocuments({ userId: req.user.id }).or([
        { title: { $regex: titlesearchparam, $options: 'i' } },
        { tags: { $in: [tagsearchparam] } },
      ]);
      return res.json({ links: urls, count });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error' });
    }
  }
  async fetchURL(req, res) {
    // #swagger.tags = ['URLs']
    // #swagger.summary = 'Получить информацию о конкретной короткой ссылке'
    // #swagger.security = [{ "bearerAuth": [] }]
    try {
      const shortURL = req.query.shortURL;
      const url = await URL.findOne({ shortURL });
      if (!url) {
        return res.status(404).json({ message: `URL is not found` });
      }
      return res.json({ url });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error' });
    }
  }

  async deleteURL(req, res) {
    // #swagger.tags = ['URLs']
    // #swagger.summary = 'Удалить короткую ссылку'
    // #swagger.security = [{ "bearerAuth": [] }]
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      const _id = req.query._id;
      const url = await URL.findOne({ _id });
      if (!url) {
        return res.status(404).json({ message: `URL is not found` });
      }
      if (req.user.id !== url.userId && req.user.role !== 'admin') {
        return res
          .status(403)
          .json({ message: 'You do not have access to this URL' });
      }
      await URL.deleteOne({ _id });
      return res.json({ message: `URL is deleted` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error' });
    }
  }

  async updateTags(req, res) {
    // #swagger.tags = ['URLs']
    // #swagger.summary = 'Обновить тэги короткой ссылки'
    // #swagger.security = [{ "bearerAuth": [] }]
    try {
      const _id = req.query._id;
      const tags = req.body.tags;
      const url = await URL.findOne({ _id });
      if (!url) {
        return res.status(404).json({ message: `URL is not found` });
      }
      if (req.user.id !== url.userId && req.user.role !== 'admin') {
        return res
          .status(403)
          .json({ message: 'You do not have access to this URL' });
      }
      if (tags.length > 20) {
        return res.status(500).json({ message: `There should be no more than 20 tags` });
      }
      await URL.findByIdAndUpdate(_id, { tags });
      return res.json({ message: `URL is updated` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Error' });
    }
  }
}

module.exports = new urlController();
