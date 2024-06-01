import React, { useEffect, useRef, useState } from "react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./Chatbot.css";
import { getAIResponse, getFollowUpQuestions } from "../api";
import LoadingSpinner from "./LoadingSpinner";

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
  const [followUpQuestions, setFollowUpQuestions] = useState([
    "How can you help me?",
    "What are the main protein families available in the database",
    "How can I find the average hydrophobicity of PF00063",
  ]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askForFollowUp = async () => {
    const payloadForFollowUp = {
      query:
        "Give me three followup questions that the user can ask based on the provided context.",
      context: messages.map((msg: Message) =>
        msg.bot
          ? { role: "assistant", content: msg.bot }
          : { role: "user", content: msg.user }
      ),
    };

    const response: any = await getFollowUpQuestions(payloadForFollowUp);

    if (
      response.follow_up_questions &&
      response.follow_up_questions.length > 1 &&
      response.follow_up_questions[0] !== ""
    ) {
      setFollowUpQuestions(response.follow_up_questions);
    }
  };

  const handleSubmit = async (e: React.FormEvent, queryString?: string) => {
    e.preventDefault();

    if (!queryString && (loading || !query || query.trim() === "") ) {
      return;
    }

    setLoading(true);

    const newMessages = [...messages, { user: queryString || query }];
    setMessages(newMessages);

    const payload = {
      query,
      context: newMessages.map((msg) =>
        msg.user
          ? { role: "user", content: msg.user }
          : { role: "assistant", content: msg.bot }
      ),
    };

    setQuery("");

    const response = await getAIResponse(payload);

    setMessages([...newMessages, { bot: response.response }]);
    setLoading(false);

    askForFollowUp();
  };

  const handleChipClick = (
    e: React.MouseEvent<HTMLDivElement>,
    chipQuestion: string
  ) => {
    console.log(chipQuestion);
    setQuery(chipQuestion);
    handleSubmit(e, chipQuestion);
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
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {msg.bot}
              </Markdown>
            )}
          </div>
        ))}
      </div>
      <div className="chips-container p-4 bg-transparent flex flex-wrap gap-2 justify-center">
        {followUpQuestions.map((question, index) => (
          <div
            key={index}
            className="chip border-blue-300 border px-8 py-2 rounded-full cursor-pointer hover:shadow-sm text-base"
            onClick={(e) => handleChipClick(e, question)}
          >
            {question}
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
          <button
            type="submit"
            className={`send-button flex w-36 justify-center ${
              (loading || query.trim() == "") && "loading"
            }`}
            disabled={loading}
          >
            {loading && <LoadingSpinner />}
            {loading ? "Sending" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
