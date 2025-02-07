import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../Styles/chatwidget.css";

const socket = io("https://rhythm-forge-api.vercel.app/");

const ChatWidget = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const userName = userData.name || "Guest";
  const userType = userData.userType || "Guest";

  // Fetch chat history only if it's empty
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`https://rhythm-forge-api.vercel.app/chat/history?userType=${userType}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);  // Store fetched messages
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory();

    // Listen for incoming messages in real-time
    socket.on("receive_message", (data) => {
      // Check if the message already exists in the state
      if (!messages.some(msg => msg.timestamp === data.timestamp)) {
        setMessages((prevMessages) => [...prevMessages, data]);  // Add new message to chat
      }
    });

    return () => {
      socket.off("receive_message"); // Cleanup socket listener on unmount
    };
  }, [messages]);  // Re-run this effect only when the messages change

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) {
      console.warn("Message is empty!");
      return;
    }

    // Prevent duplicate messages by checking if it's already in state
    const newMessage = { sender: userName, senderType: userType, message, timestamp: Date.now() };

    // Avoid sending the message if it's already in the state
    if (messages.some(msg => msg.timestamp === newMessage.timestamp)) {
      console.warn("Message already sent.");
      return;
    }

    try {
      // Emit the message via socket to other users in real-time
      socket.emit("send_message", newMessage, (response) => {
        if (response.status === "success") {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setMessage(""); // Reset message input field
        } else {
          console.error("Error sending message:", response.message);
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <>
      {!isOpen && (
        <button className="chat-btn" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {isOpen && (
        <div className={`chat-container ${isMinimized ? "minimized" : "expanded"}`}>
          <div className="chat-header" onClick={() => setIsMinimized(false)}>
            <h3>Chat ({userType})</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-body">
                {messages.length === 0 ? (
                  <p className="no-messages">No messages yet</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender === userName ? "sent" : "received"}`}>
                      <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                  ))
                )}
              </div>

              <div className="chat-footer">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
