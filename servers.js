const express = require("express");
const bodyParser = require("body-parser");
const deviceIpRouter = require("./deviceip");
const userSignupRouter = require("./userSignup");
const userLoginRouter = require("./login");
const forgotPasswordRouter = require("./forgotPassword"); // Import forgot password router
const resetPasswordRouter = require("./resetPassword"); // Import reset password router
const laptopsRouter = require("./retrivedevicename");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", deviceIpRouter);
app.use("/api", userSignupRouter);
app.use("/api", userLoginRouter);
app.use("/api", forgotPasswordRouter); // Use forgot password router
app.use("/api", resetPasswordRouter); // Use reset password router
app.use("/api", laptopsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
