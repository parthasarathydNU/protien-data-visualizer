import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Chatbot.css'; // Ensure you have the appropriate styles

interface Message {
  user?: string;
  bot?: string;
}

const Chatbot: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuery('');
    const newMessages = [...messages, { user: query }];
    setMessages(newMessages);

    const response = await axios.post('http://localhost:8000/query/', {
      query,
      context: newMessages.map(msg => msg.user ? {"role": "user", "content": msg.user} : {"role": "assistant", "content": msg.bot})
    });

    setMessages([...newMessages, { bot: response.data.response }]);
    
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
      setQuery('');
    }
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? 'message user' : 'message bot'}>
            {msg.user ? (
              msg.user
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.bot}</ReactMarkdown>
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
          <button type="submit" className="send-button">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
