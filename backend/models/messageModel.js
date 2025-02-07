const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  senderType: { type: String, required: true },
  receiver: { type: String },  // ✅ Not required anymore
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

module.exports = Message;
