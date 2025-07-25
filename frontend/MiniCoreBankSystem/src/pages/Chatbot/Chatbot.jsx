import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm CoreBank Assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send request with correct 'question' key
      const res = await axios.post("http://localhost:8085/api/chat", { question: input });
      
      // Extract AI reply from response.answer
      const data = res.data;
      const botReply = data.answer || "❌ I didn't get that.";

      setMessages(prev => [...prev, { role: "assistant", content: botReply }]);
      setInput("");
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection error." }]);
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-[450px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <span className="font-semibold">CoreBank Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-lg font-bold" aria-label="Close Chatbot">×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-xl max-w-xs ${
                  msg.role === "user" ? "ml-auto bg-indigo-100" : "mr-auto bg-purple-100"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-slate-200 flex items-center bg-white">
            <input
              type="text"
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl p-4 hover:scale-105 transition-transform"
          aria-label="Open Chatbot"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
