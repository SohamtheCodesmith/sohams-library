import { useState } from "react";
import "./ChatPopup.css";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function ChatPopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        sender: "ai",
        text: data.reply || "I couldn't understand that.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error connecting to the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>Library Assistant</span>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="msg ai">...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Ask me about books..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}