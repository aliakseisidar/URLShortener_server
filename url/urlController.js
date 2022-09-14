const URL = require("../models/URL");
const { validationResult } = require("express-validator");

const shortURLgenerator = () => {
  return `${(Math.random() + 1).toString(36).substring(7)}`;
};

class urlController {
  async shortURL(req, res) {
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "The error occurred", errors });
      }

      const { originalURL, title, tags } = req.body;
      const path = shortURLgenerator();

      const url = new URL({
        title,
        originalURL,
        shortURL: `http://localhost:5000/${path}`,
        path,
        createdAt: new Date().toISOString(),
        userId: req.user.id,
        tags,
      });
      await url.save();
      return res.json({ message: "URL created succesfully", URL: url });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }

  async fetchURLs(req, res) {
    try {
      const { offset, limit } = req.headers;
      const urls = await URL.find({ userId: req.user.id })
        .sort({ createdAt: "asc" })
        .limit(limit)
        .skip(offset);
      const count = await URL.countDocuments({ userId: req.user.id });
      return res.json({ links: urls, count });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }

  async searchURLs(req, res) {
    try {
      /*    const user = {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      }; */
      const { offset, limit, tagsearchparam, titlesearchparam } = req.headers;
      const urls = await URL.find({ userId: req.user.id })
        .or([
          { title: { $regex: titlesearchparam, $options: "i" } },
          { tags: { $in: [tagsearchparam] } },
        ])
        .sort({ createdAt: "asc" })
        .limit(limit)
        .skip(offset);
      const count = await URL.countDocuments({ userId: req.user.id }).or([
        { title: { $regex: titlesearchparam, $options: "i" } },
        { tags: { $in: [tagsearchparam] } },
      ]);
      return res.json({ links: urls, count });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }
  async fetchURL(req, res) {
    try {
      const shortURL = req.query.shortURL;
      const url = await URL.findOne({ shortURL });
      if (!url) {
        return res.status(404).json({ message: `URL is not found` });
      }
      return res.json({ url });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }

  async deleteURL(req, res) {
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      const _id = req.query._id;
      const url = await URL.findOne({ _id });
      if (!url) {
        return res.status(404).json({ message: `URL is not found` });
      }
      if (req.user.id !== url.userId && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You do not have access to this URL" });
      }
      await URL.deleteOne({ _id });
      return res.json({ message: `URL is deleted` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }

  async updateTags(req, res) {
    try {
      const _id = req.query._id;
      const tags = req.body.tags;
      const url = await URL.findOne({ _id });
      if (!url) {
        return res.status(404).json({ message: `URL is not found` });
      }
      if (req.user.id !== url.userId && req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You do not have access to this URL" });
      }
      await URL.findByIdAndUpdate(_id, { tags });
      return res.json({ message: `URL is updated` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }
}

module.exports = new urlController();
