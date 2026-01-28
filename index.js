const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./user/authRouter");
const urlRouter = require("./url/urlRouter");
const adminRouter = require("./admin/adminRouter");
const redirectRouter = require("./redirect/redirectRouter");
const { mongoDB_URI } = require("./config");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const cors = require("cors");
const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: ['Location'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionSuccessStatus: 200,
};

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/url", urlRouter);
app.use("/admin", adminRouter);
app.use("/", redirectRouter);

const start = async () => {
  try {
    await mongoose.connect(mongoDB_URI);
    app.listen(PORT, () => console.log("Server works..."));
  } catch (error) {
    console.log(error);
  }
};

start();
