const express = require("express");
require("dotenv").config();
const connectDB = require("./src/db/connect");
const { dbUrl, serverPort } = require("./src/config/setting");
var cors = require("cors");

const authRoute = require("./src/routes/auth");
const userRouter = require("./src/routes/user");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("APP is working!");
});

app.get("/api", (req, res) => {
  res.send("API is working!");
});

app.use("/api/v1", userRouter);
app.use("/api/v1", authRoute);

const port = serverPort || 5000;
const start = async () => {
  try {
    connectDB(dbUrl);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("error =>", error);
  }
};
start();
