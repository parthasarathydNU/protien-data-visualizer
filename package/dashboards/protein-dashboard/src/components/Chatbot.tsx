import React, { useEffect, useRef, useState } from "react";

import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./Chatbot.css";
import { getAIResponse } from "../api";

interface Message {
  user?: string;
  bot?: string;
}

const Chatbot: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      bot: "Welcome to the Protein Dashboard Chatbot! How can I assist you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuery("");
    const newMessages = [...messages, { user: query }];
    setMessages(newMessages);
    
    const payload = {
        query,
        context: newMessages.map((msg) =>
          msg.user
            ? { role: "user", content: msg.user }
            : { role: "assistant", content: msg.bot }
        ),
      }
    
    const response = await getAIResponse(payload);

    setMessages([...newMessages, { bot: response.data.response }]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
      setQuery("");
    }
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user ? "message user" : "message bot"}
          >
            {msg.user ? (
              msg.user
            ) : (
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {msg.bot}
              </Markdown>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="input-field"
          />
          <button type="submit" className="send-button">
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
