const express = require("express");
const userRouter = require("./routes/user");
const {courseRouter} = require("./routes/course");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
