const express = require("express");
const dotenv = require("dotenv");
require("./model/index");
const app = express();
const authRoute = require("./routes/authRoutes");
const { renderHomePage } = require("./controllers/authController");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/css"));

dotenv.config();

const PORT = process.env.PORT || 4000;
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// const path = require("path");

app.get("/", renderHomePage);

app.use("/", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running in PORT No. ${PORT}`);
});
