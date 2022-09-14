const User = require("../models/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

const generateAccessToken = (id, username, role) => {
  const payload = {
    id,
    username,
    role,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};
class authController {
  async registration(req, res) {
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: `The error(s) occurred: ${errors.errors[0].msg}`,
        });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = new User({ username, password });
      await user.save();
      return res.status(200).json({ message: "User created succesfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }
  async login(req, res) {
    try {
      //timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      //end timeout
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: `The error occurred: ${errors.errors[0].msg}`,
        });
      }
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `User ${username} is not found` });
      }
      if (password !== user.password) {
        return res.status(400).json({ message: "Password is not valid" });
      }
      const token = generateAccessToken(user._id, user.username, user.role);
      return res.json({ token, role: user.role });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error" });
    }
  }
}

module.exports = new authController();
