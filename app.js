const express = require("express");
const dotenv = require("dotenv").config();
const CORS = require("cors");

const connectDB = require("./config/dbConfig");
const authRouter = require("./routes/auth.routes");
const bookRouter = require("./routes/book.routes");
const userRouter = require("./routes/user.routes");
const superAdminRouter = require("./routes/superAdmin.routes");
const errorHandler = require("./controllers/error.controller");

const app = express();

connectDB();

app.use(CORS())

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/superAdmin", superAdminRouter);

// error handler
app.use(errorHandler);

module.exports = app;