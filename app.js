'use strict';
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();

const log = require("./utils/Logger");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

// env
const port = process.env.PORT || 8000;
const database = process.env.DATABASE

// db
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    log.debug('Database connection established');
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
app.use("/api", productRoutes);

app.listen(port, () => {
    log.debug("Server running on port", port);
})