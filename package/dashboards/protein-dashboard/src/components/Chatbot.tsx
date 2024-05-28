import React, { useState } from 'react';
import axios from 'axios';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string, bot: string }[]>([]);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSend = async () => {
    const userMessage = { user: query, bot: '' };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('http://localhost:8000/query/', { query });
      const botMessage = { user: query, bot: `Generated SQL Query: ${response.data.sql_query}` };
      setMessages([...messages, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      const botMessage = { user: query, bot: 'Sorry, something went wrong. Please try again.' };
      setMessages([...messages, botMessage]);
    }
    setQuery('');
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className="chatbot-message">
            <p><strong>You:</strong> {message.user}</p>
            <p><strong>Bot:</strong> {message.bot}</p>
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Ask something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
