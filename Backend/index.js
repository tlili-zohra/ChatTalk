import express from "express";
import dotenv from "dotenv";
const app = express();
import mongoose from "mongoose";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
const server = createServer(app);
import authRoute from "./routes/auth.js";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";
import authenticateUser from "./middleware/auth.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 4000;
const connectedUsers = new Map();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hey!! This is a sign that the server is running");
});

app.use("/auth", authRoute);
app.use("/chat", authenticateUser, chatRoute);
// app.use("/chat", chatRoute);
// app.use("/message", messageRoute);
app.use("/message", authenticateUser, messageRoute);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected " + socket.id);
  socket.on("setup", (userData) => {
    if (!userData?._id) {
      console.log("Invalid userData, missing _id");
      return;
    }
    connectedUsers.set(userData._id, socket.id);
    socket.join(userData._id);
    console.log(userData._id + " connected");
    console.log("connectedUsers", connectedUsers);
    io.emit("connected-users", Array.from(connectedUsers.keys()));
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    console.log(room + " joined");
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

  socket.on("new-message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log(`chat.users not defined`);

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      console.log("Hey got a message " + newMessageReceived);
      socket.in(user._id).emit("message-received", newMessageReceived);
    });
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected " + socket.id);
    // Find and remove user from connectedUsers
    for (const [userId, socketId] of connectedUsers) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`${userId} disconnected`);
        // Broadcast updated user list
        io.emit("connected-users", Array.from(connectedUsers.keys()));
        break;
      }
    }
  });
  socket.off("setup", () => {
    console.log("Socket disconnected");
    socket.leave(userData._id);
  });
});

server.listen(PORT, () => console.log("Server is running on port", PORT));
// Serve React static files and handle React routing in production
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
  });
}
