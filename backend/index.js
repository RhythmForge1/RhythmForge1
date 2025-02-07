const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require("./routes/AuthRouter");
const projectRoutes = require("./routes/projectRoutes")
const escalationRoutes = require("./routes/escalationRoutes")
const messageRoutes = require("./routes/chatRoutes")
const chatRoutes = require("./routes/chatRoutes")
const { Server } = require("socket.io");
const { createServer } = require("http");
const teamRoutes = require("./routes/teamRoutes")
const employeeRoutes = require("./routes/employeeRoutes");
const deliverableRoutes = require("./routes/deliverableRoute");
const gamificationRoutes = require("./routes/gamificationRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require('mongoose');
const Message = require("./models/messageModel")
const attachmentRoutes = require("./routes/attachmentRoute")

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "https://rhythm-forge-api.vercel.app/", // Allow requests from your frontend
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json()); // Parse JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Routes
app.use("/auth", AuthRouter);
app.use('/api/projects', projectRoutes);
app.use('/api', escalationRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use('/api', teamRoutes);
app.use("/api/members", employeeRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/members/create", employeeRoutes); 
app.use("/api/deliverables", deliverableRoutes);
app.use("/api", gamificationRoutes);
app.use("/api/milestones", gamificationRoutes);
app.use("/api", AuthRouter)
app.use("/api", userRoutes);
app.use("/api/attachments", attachmentRoutes)
// Create HTTP server and Socket.IO server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://rhythm-forge-api.vercel.app/", // Adjust this to match your frontend's origin
    methods: ["GET", "POST"],
  },
});

const users = {};  // Store connected users {socketId: userType}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", async (data, callback) => {
    console.log("Message received:", data);

    try {
      // Check if the message already exists in the database (using the timestamp or message content)
      const existingMessage = await Message.findOne({ timestamp: data.timestamp });

      if (existingMessage) {
        console.warn("Duplicate message detected, not saving.");
        callback && callback({ status: "error", message: "Message already sent" });
        return;  // Do not store or emit the message if it already exists
      }

      // Store message in the database
      const newMessage = new Message({
        sender: data.sender,
        senderType: data.senderType,
        receiver: data.senderType === "Vendor" ? "Internal" : "Vendor", // To handle chat between Vendor and Internal
        message: data.message,
        timestamp: new Date(data.timestamp),
      });

      await newMessage.save();

      // Emit the message to all connected clients after it is stored
      io.emit("receive_message", {
        sender: data.sender,
        senderType: data.senderType,
        message: data.message,
        timestamp: data.timestamp,
      });

      callback && callback({ status: "success" });
    } catch (error) {
      console.error("Error saving message:", error);
      callback && callback({ status: "error", message: "Error saving message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
