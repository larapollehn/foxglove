'use strict';
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/user");

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
app.use("/api", userRoutes);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})