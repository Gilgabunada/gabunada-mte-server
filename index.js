const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const user = require("./routes/user.js");
const blog = require("./routes/blog.js");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Connected to MongoDB Atlas"));

app.use("/users", user);
app.use("/posts", blog);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

module.exports = app;