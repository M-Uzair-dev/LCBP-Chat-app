const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./Routes/authroute");
const chatsRoute = require("./Routes/chatsroute");
const messagesroute = require("./Routes/messagesroute");
const bodyparser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "https://messegit.vercel.app",
  })
);

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch((err) => {});

app.use("/chats", chatsRoute);
app.use("/auth", authRoute);
app.use("/messages", messagesroute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
