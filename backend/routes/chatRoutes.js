const express = require("express");
const router = express.Router();
const Message = require("../models/chatModel");

// ✅ Store message in DB and emit to all relevant users
router.post("/send", async (req, res) => {
    try {
      const { sender, senderType, message } = req.body;
  
      if (!sender || !message) {
        return res.status(400).json({ success: false, error: "Missing sender or message" });
      }
  
      let receiver = senderType === "Vendor" ? "Internal" : "Vendor";
  
      // Store message in DB
      const newMessage = new Message({ sender, senderType, receiver, message, timestamp: new Date() });
      await newMessage.save();
  
      res.status(201).json({ success: true, message: "Message stored" });
    } catch (error) {
      console.error("Error storing message:", error);
      res.status(500).json({ success: false, error: "Message not stored" });
    }
  });
  
  // Fetch chat history for both Vendor & Internal users
  router.get("/history", async (req, res) => {
    try {
      const { userType } = req.query;
  
      if (!userType) {
        return res.status(400).json({ success: false, error: "Missing user type" });
      }
  
      const messages = await Message.find({
        $or: [{ senderType: userType }, { receiver: userType }],
      }).sort({ timestamp: 1 });
  
      res.json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });


module.exports = router;
