const { Schema, model } = require("mongoose");

const URL = new Schema({
  title: { type: String, required: true },
  originalURL: { type: String, required: true },
  shortURL: { type: String, unique: true, required: true },
  path: { type: String, unique: true, required: true },
  createdAt: { type: String, required: true },
  userId: { type: String, required: true },
  tags: { type: Array, default: [], required: true },
  clicks: { type: Number, default: 0, required: true },
});

module.exports = model("URL", URL);
