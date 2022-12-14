/** Require */
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const cors = require("cors");
const session = require("express-session");
// const mongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

/** Environmental Variable */
const PORT = process.env.PORT ?? 3000;
// const MONGO_URI = "mongodb://localhost:27017/JipgyeRIA";
const MONGO_URI =
  process.env.npm_command == "test"
    ? "mongodb://localhost:27017/JipgyeRIA"
    : process.env.MONGO_URI ?? "mongodb://localhost:27017/JipgyeRIA";

/** Import Router */
const orderRouter = require("./routers/order.router");
const adminRouter = require("./routers/admin.router");
const faceRouter = require("./routers/face.router");

/** Set View Engine */
app.engine("ejs", ejsMate);
app.use(cors({ credentials: "include" }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const cookieOption = {
  maxAge: 1000000,
  httpOnly: true,
  secure: false,
};

app.use(
  session({
    secret: process.env.session_secret ?? "test_secret",
    resave: false,
    saveUninitialized: true,
    // store: mongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: cookieOption,
  })
);

/** Static Files Setting */
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** DB Connect */
mongoose.connect(MONGO_URI, () => {
  console.log("database connected");
});

/** Handler: Router Setting */
app.use("/order", orderRouter);
app.use("/admin", adminRouter);
app.use("/face", faceRouter);

/** Server */
app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
