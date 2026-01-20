const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const initSocket = require("./socket");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

initSocket(server);

app.get("/", (req, res) => {
  res.send("Chat Backend API is running");
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
