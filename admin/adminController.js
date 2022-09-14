const User = require("../models/User");
const URL = require("../models/URL");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const yup = require("yup");

class adminController {
  async getUsers(req, res) {
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: `Users cannot do it!` });
      }
      const { offset, limit, searchparam } = req.headers;
      if (!searchparam) {
        const users = await User.find().limit(limit).skip(offset);
        const count = await User.countDocuments();
        return res.status(200).json({ users, count });
      } else {
        const users = await User.find({
          username: { $regex: ".*" + searchparam + ".*" },
        })
          .limit(limit)
          .skip(offset);
        const count = await User.countDocuments({
          username: { $regex: ".*" + searchparam + ".*" },
        });
        return res.status(200).json({ users, count });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }

  async updateUser(req, res) {
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      const _id = req.query._id;
      const { username, password, role } = req.body;
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: `Users cannot do it!` });
      }
      const user = await User.findOne({ _id });
      if (!user) {
        return res.status(404).json({ message: `User is not found` });
      }
      await User.findByIdAndUpdate(_id, { username, password, role });
      return res.json({ message: `${username} user updated` });
    } catch (error) {
      console.log(error);
      if (error.codeName === "DuplicateKey") {
        return res
          .status(400)
          .json({ message: "Provided username already exists" });
      }
      res.status(400).json({ message: "Error" });
    }
  }

  async deleteUser(req, res) {
    try {
      const _id = req.query._id;
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: `Users cannot do it!` });
      }
      const user = await User.findOne({ _id });
      if (!user) {
        return res.status(404).json({ message: `User is not found` });
      }
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      await User.deleteOne({ _id });
      await URL.deleteMany({ userId: _id });
      return res.json({ message: `User and his URLs are deleted` });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }

  async fetchURLsByUser(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: `Users cannot do it!` });
      }
      const { offset, limit, userid } = req.headers;
      const urls = await URL.find({ userId: userid })
        .sort({ createdAt: "asc" })
        .limit(limit)
        .skip(offset);
      const count = await URL.countDocuments({ userId: userid });
      return res.json({ links: urls, count });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }
}

module.exports = new adminController();
