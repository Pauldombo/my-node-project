const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const deviceIpRouter = require("./deviceip");
const userLoginRouter = require("./login");
const laptopsRouter = require("./retrivedevicename");
const usersignup = require("./signupuser"); // Import the signup router

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", deviceIpRouter);
app.use("/api", userLoginRouter);
app.use("/api", laptopsRouter);
app.use("/api", usersignup); // Use the signup router

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
