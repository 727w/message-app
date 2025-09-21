const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
require("dotenv").config();
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("public/images"));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Message App API" });
});

app.use("/", userRouter);
app.use("/", authRouter);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
