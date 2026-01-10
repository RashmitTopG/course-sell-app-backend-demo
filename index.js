const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const {courseRouter} = require("./routes/course");
const adminRouter = require("./routes/admin");
const env = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin" , adminRouter);


async function start(){
    await mongoose.connect(DB_URL)
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
}

start();