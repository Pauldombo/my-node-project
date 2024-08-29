const express = require("express");
const bodyParser = require("body-parser");
const deviceIpRouter = require("./deviceip");
const userLoginRouter = require("./login");
const laptopsRouter = require("./retrivedevicename");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", deviceIpRouter);
app.use("/api", userLoginRouter);
app.use("/api", laptopsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
