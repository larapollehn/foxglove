'use strict';
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");

// env
const port = process.env.PORT || 8000;
const database = process.env.DATABASE

// db
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB connected");
})

// app
const app = express();

// routes
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})