const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./user/authRouter");
const urlRouter = require("./url/urlRouter");
const adminRouter = require("./admin/adminRouter");
const redirectRouter = require("./redirect/redirectRouter");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/url", urlRouter);
app.use("/admin", adminRouter);
app.use("/", redirectRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://aliaksei:qwe123@cluster0.vhqbs.mongodb.net/?retryWrites=true&w=majority"
    );
    app.listen(PORT, () => console.log("Server works..."));
  } catch (error) {
    console.log(error);
  }
};

start();
